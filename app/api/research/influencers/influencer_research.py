import os
import json
from typing import TypedDict, List, Optional, Literal
import httpx
import asyncio
from supabase import create_client, Client

PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY")
PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions"
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

class ContentData(TypedDict):
    mainCategories: List[str]
    contentStyle: str
    postFrequency: str
    engagementRate: str
    popularContentTypes: List[str]

class BackgroundData(TypedDict):
    biography: str
    expertise: List[str]
    achievements: List[str]
    careerHighlights: List[str]

class TargetAudienceData(TypedDict):
    demographics: List[str]
    interests: List[str]
    locationFocus: str
    engagementPatterns: str

class KeyTopicsData(TypedDict):
    primaryTopics: List[str]
    recurringThemes: List[str]
    brandAlignments: List[str]
    valueProposition: str

class ResearchData(TypedDict):
    type: Literal['content', 'background', 'targetAudience', 'keyTopics']
    data: ContentData | BackgroundData | TargetAudienceData | KeyTopicsData

class ResearchResult(TypedDict):
    data: ResearchData
    citations: List[str]

def clean_json_response(content: str) -> str:
    """Clean the JSON response from Perplexity API."""
    json_match = content.strip()
    if json_match.startswith("```json"):
        json_match = json_match[7:-3]
    elif json_match.startswith("```"):
        json_match = json_match[3:-3]
    return json_match.strip()

async def perform_specialized_research(
    area: str,
    description: str,
    prompt: str,
    name: str,
    tiktok_profile_link: str
) -> ResearchResult:
    """
    Perform specialized research for a specific area of influencer analysis.
    """
    if not PERPLEXITY_API_KEY:
        raise ValueError("PERPLEXITY_API_KEY not configured")

    full_prompt = f"""Research the TikTok influencer {name} (profile: {tiktok_profile_link}).
{prompt}"""

    max_retries = 3
    for attempt in range(max_retries):
        try:
            async with httpx.AsyncClient(timeout=100.0) as client:  # Increased timeout to 100 seconds
                response = await client.post(
                    PERPLEXITY_API_URL,
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
                    },
                    json={
                        "model": "sonar",
                        "messages": [
                            {
                                "role": "system",
                                "content": "You are a specialized research agent that MUST ALWAYS respond with valid JSON only. Do not include any text before or after the JSON."
                            },
                            {
                                "role": "user",
                                "content": full_prompt
                            }
                        ],
                        "temperature": 0.1,
                        "max_tokens": 2000,
                        "response_format": {"type": "text"}
                    },
                )
                
                data = response.json()
                
                if not response.status_code == 200:
                    raise Exception(f"API returned status code {response.status_code}: {data}")
                
                if "choices" not in data or not data["choices"]:
                    raise Exception(f"No choices in API response: {data}")
                    
                cleaned_content = clean_json_response(data["choices"][0]["message"]["content"])
                research_data = json.loads(cleaned_content)
                
                return {
                    "data": {
                        "type": area,
                        "data": research_data
                    },
                    "citations": data.get("citations", [])
                }

        except httpx.TimeoutException as e:
            if attempt == max_retries - 1:  # Last attempt
                raise
            await asyncio.sleep(2 * (attempt + 1))  # Exponential backoff
        except Exception as e:
            raise

async def research_influencer(name: str, tiktok_profile_link: str) -> dict:
    """
    Research an influencer using multiple specialized API calls and store in Supabase.
    """
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Supabase credentials not configured")
        
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

    research_areas = [
        {
            "name": "content",
            "description": "Content Analysis",
            "prompt": """Analyze the influencer's content in detail.
Focus on:
1. Main content categories and themes
2. Content style and tone
3. Posting frequency and consistency
4. Engagement metrics
5. Popular content formats

Format your response as JSON:
{
  "mainCategories": string[],
  "contentStyle": string,
  "postFrequency": string,
  "engagementRate": string,
  "popularContentTypes": string[]
}"""
        },
        {
            "name": "background",
            "description": "Background Information",
            "prompt": """Research the influencer's background and expertise.
Focus on:
1. Professional and personal biography
2. Areas of expertise
3. Notable achievements
4. Career progression and highlights

Format your response as JSON:
{
  "biography": string,
  "expertise": string[],
  "achievements": string[],
  "careerHighlights": string[]
}"""
        },
        {
            "name": "targetAudience",
            "description": "Target Audience Analysis",
            "prompt": """Analyze the influencer's target audience.
Focus on:
1. Demographic information
2. Audience interests and preferences
3. Geographic distribution
4. Engagement patterns

Format your response as JSON:
{
  "demographics": string[],
  "interests": string[],
  "locationFocus": string,
  "engagementPatterns": string
}"""
        },
        {
            "name": "keyTopics",
            "description": "Key Topics & Themes",
            "prompt": """Analyze the main topics and themes in the influencer's content.
Focus on:
1. Primary content topics
2. Recurring themes and messages
3. Brand collaborations and alignments
4. Overall value proposition

Format your response as JSON:
{
  "primaryTopics": string[],
  "recurringThemes": string[],
  "brandAlignments": string[],
  "valueProposition": string
}"""
        }
    ]

    try:
        research_promises = [
            perform_specialized_research(
                area["name"],
                area["description"],
                area["prompt"],
                name,
                tiktok_profile_link
            )
            for area in research_areas
        ]

        research_results = await asyncio.gather(*research_promises)
        
        # Consolidate all citations
        all_citations = []
        for result in research_results:
            all_citations.extend(result["citations"])
        unique_citations = list(set(all_citations))

        # Extract research data
        content = next(r for r in research_results if r["data"]["type"] == "content")
        background = next(r for r in research_results if r["data"]["type"] == "background")
        target_audience = next(r for r in research_results if r["data"]["type"] == "targetAudience")
        key_topics = next(r for r in research_results if r["data"]["type"] == "keyTopics")

        result = {
            "content": content["data"]["data"],
            "background": background["data"]["data"],
            "targetAudience": target_audience["data"]["data"],
            "keyTopics": key_topics["data"]["data"],
            "citations": unique_citations
        }

        # Update the influencer record in Supabase
        supabase.table("influencers").update({
            "influencer_research": result
        }).eq("name", name).execute()

        return result

    except Exception as e:
        print(f"Error researching influencer {name}: {str(e)}")
        raise

async def research_all_influencers():
    """
    Research all influencers in the Supabase table that don't have research data.
    """
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Supabase credentials not configured")
        
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    try:
        # Fetch only influencers without research data
        response = supabase.table("influencers").select(
            "id, name, tiktok_profile_link, influencer_research"
        ).is_("influencer_research", "null").execute()
        
        influencers = response.data
        
        print(f"Found {len(influencers)} influencers that need research")
        
        for influencer in influencers:
            max_retries = 3
            retry_delay = 60  # Start with 1 minute delay
            
            for attempt in range(max_retries):
                try:
                    print(f"Researching {influencer['name']}... (attempt {attempt + 1}/{max_retries})")
                    await research_influencer(
                        name=influencer['name'],
                        tiktok_profile_link=influencer['tiktok_profile_link']
                    )
                    print(f"Successfully researched {influencer['name']}")
                    break
                    
                except Exception as e:
                    error_str = str(e)
                    if "rate limit" in error_str.lower():
                        if attempt < max_retries - 1:
                            print(f"Rate limited. Waiting {retry_delay} seconds before retry...")
                            await asyncio.sleep(retry_delay)
                            retry_delay *= 2  # Double the delay for next attempt
                            continue
                    
                    print(f"Error researching {influencer['name']}: {error_str}")
                    break
            
            # Optional: Add a small delay between influencers to avoid rate limits
            await asyncio.sleep(5)
                
        print("Completed researching all influencers")
        
    except Exception as e:
        print(f"Error fetching influencers: {str(e)}")
        raise

if __name__ == "__main__":
    async def main():
        try:
            await research_all_influencers()
        except Exception as e:
            print(f"Error: {str(e)}")

    asyncio.run(main())
