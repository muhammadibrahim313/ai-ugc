import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";

import { useProductContext } from "../../contexts/product-context";
import { Skeleton } from "@/components/ui/skeleton";
import { SourceIcon } from "./components/source-icon";

function BulletList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      {items.map((item, i) => (
        <span key={i} className="text-xs text-muted-foreground">• {item}</span>
      ))}
    </div>
  );
}

// Sleek collapsible section component
function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  className = ""
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  return (
    <Collapsible
      defaultOpen={defaultOpen}
      className={`border rounded-lg bg-muted/30 overflow-hidden ${className}`}
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left">
        <h3 className="text-sm font-medium">{title}</h3>
        <div className="text-muted-foreground">
          <ChevronRight className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-90" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 py-3 border-t border-t-muted/50">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function MarketStrategyView() {
  const {
    productResearch: { data },
  } = useProductContext();

  if (data === undefined) {
    return (
      <div className="space-y-6 w-full">
        <Skeleton className="w-full h-[200px]" />
        <Skeleton className="w-full h-[500px]" />
      </div>
    );
  }

  // Extract data for easier access
  const { summary, citations } = data;
  const { market, competition } = summary.detailedAnalysis;

  return (
    <div className="space-y-6 w-full">

      {/* Research and Quality Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Sources</h3>
          <span className="text-xs text-muted-foreground">{citations.length} verified sources</span>
        </div>
        
        <div className="relative">
          <div className="flex overflow-x-auto pb-4 pt-1 -mx-1 no-scrollbar">
            <div className="flex gap-2 px-1">
              {citations.map((citation, i) => {
                const urlMatch = citation.match(/https?:\/\/([^\/]+)/);
                const domain = urlMatch ? urlMatch[1] : "";
                const nameMatch = citation.match(/^(.*?)\s*-\s*http/);
                const name = nameMatch ? nameMatch[1] : domain;

                return (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-center p-3 rounded-md border bg-muted/30 min-w-16 hover:bg-muted/50 transition-colors"
                  >
                    <div className="mb-1.5">
                      <SourceIcon domain={domain} name={name} />
                    </div>
                    <span className="text-[10px] text-muted-foreground text-center truncate max-w-24">{name}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <style jsx>{`
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .no-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
        </div>

        <div className="text-xs text-muted-foreground mt-4 pt-4 border-t">
          <p>All sources have been analyzed and verified for relevance and accuracy.</p>
        </div>
      </div>

      {/* Market Demographics */}
      <div className="mb-5">
        <div className="p-4 bg-background/60 rounded-md border shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-foreground/80">Market Overview</h3>
            <Badge variant="outline" className="text-xs bg-primary/5 hover:bg-primary/10">
              {market.primaryMarket.marketSize}
            </Badge>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Demographics</p>
              <div className="flex flex-wrap gap-1">
                {market.primaryMarket.demographics.map((demo, i) => (
                  <Badge key={i} variant="secondary" className="text-[10px] font-normal">
                    {demo}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">Psychographics</p>
              <div className="flex flex-wrap gap-1">
                {market.primaryMarket.psychographics.map((psycho, i) => (
                  <Badge key={i} variant="outline" className="text-[10px] font-normal">
                    {psycho}
                  </Badge>
                ))}
              </div>
            </div>

            {market.secondaryMarkets.length > 0 && (
              <div className="border-t border-border/40 pt-3 mt-1">
                <p className="text-xs text-muted-foreground mb-2">Secondary Markets</p>
                <div className="flex flex-wrap gap-1">
                  {market.secondaryMarkets.map((secondaryMarket, index) => (
                    <Badge key={index} variant="outline" className="text-[10px] bg-secondary/5">
                      {secondaryMarket.segment}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Collapsible Content Sections */}
      <div className="space-y-4">
        {/* Use Cases Section */}
        <CollapsibleSection
          title="Use Cases"
          defaultOpen={false}
          className="transition-all duration-200"
        >
          {/* Key Insights */}
          {summary.productSummary.keyInsights.length > 0 && (
            <div className="mb-5">
              <h4 className="text-xs font-medium mb-3 text-muted-foreground uppercase tracking-wider">Key Insights</h4>
              <div className="pl-1">
                <BulletList items={summary.productSummary.keyInsights} />
              </div>
            </div>
          )}

          {/* Use Cases */}
          <div className="relative">
            <div className="flex overflow-x-auto -mx-1 pb-2 no-scrollbar">
              <div className="flex gap-3 px-1">
                {market.useCases.map((useCase, index) => (
                  <div
                    key={index}
                    className="p-3 bg-muted/50 rounded-lg border min-w-[260px] max-w-[300px] flex-shrink-0 hover:bg-muted/70 transition-colors"
                  >
                    <h4 className="text-sm font-medium mb-2 text-foreground">{useCase.scenario}</h4>
                    <div className="pl-0.5">
                      <BulletList items={useCase.benefits} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <style jsx>{`
              .no-scrollbar::-webkit-scrollbar {
                display: none;
              }
              .no-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>
          </div>
        </CollapsibleSection>

        {/* Target Audience Section */}
        <CollapsibleSection title="User Personas">
          <div className="space-y-4">
            <div className="grid gap-3">
              {market.userPersonas.map((persona, index) => (
                <div key={index} className="p-3 bg-muted/40 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-foreground">{persona.type}</h3>
                    <Badge variant="outline" className="text-[10px]">Persona</Badge>
                  </div>

                  <p className="text-xs text-muted-foreground mb-3">{persona.description}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {persona.needs.map((need, i) => (
                      <Badge key={i} variant="secondary" className="text-[10px]">{need}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleSection>

        {/* Competition Section */}
        <CollapsibleSection title="Competition">
          {/* Market Position Overview */}
          <div className="mb-6">
            <h4 className="text-xs font-medium mb-3 text-muted-foreground uppercase tracking-wider">Market Position</h4>
            <div className="grid grid-cols-3 gap-4 p-3 bg-muted/40 rounded-lg border">
              <div>
                <h4 className="text-sm font-medium mb-2 text-foreground">Advantages</h4>
                <BulletList items={competition.marketPosition.uniqueAdvantages} />
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2 text-foreground">Challenges</h4>
                <BulletList items={competition.marketPosition.challenges} />
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2 text-foreground">Opportunities</h4>
                <BulletList items={competition.marketPosition.opportunities} />
              </div>
            </div>
          </div>

          {/* Direct Competitors */}
          <div className="mb-6">
            <h4 className="text-xs font-medium mb-3 text-muted-foreground uppercase tracking-wider">Direct Competitors</h4>
            <div className="space-y-3">
              {competition.directCompetitors.map((competitor, index) => (
                <div key={index} className="p-3 bg-muted/40 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-medium text-foreground">{competitor.name}</h3>
                      <Badge variant="outline" className="text-[10px] mt-1">{competitor.pricePoint}</Badge>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">Direct Competitor</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-medium mb-2 text-muted-foreground">Strengths</h4>
                      <BulletList items={competitor.strengths} />
                    </div>

                    <div>
                      <h4 className="text-xs font-medium mb-2 text-muted-foreground">Weaknesses</h4>
                      <BulletList items={competitor.weaknesses} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indirect Competitors */}
          <div>
            <h4 className="text-xs font-medium mb-3 text-muted-foreground uppercase tracking-wider">Indirect Competitors</h4>
            <div className="space-y-3">
              {competition.indirectCompetitors.map((competitor, index) => (
                <div key={index} className="p-3 bg-muted/40 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-foreground">{competitor.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">{competitor.threatLevel}</Badge>
                      <Badge variant="secondary" className="text-[10px]">Indirect</Badge>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {competitor.differentiators.map((diff, i) => (
                      <Badge key={i} variant="outline" className="text-[10px]">{diff}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}
