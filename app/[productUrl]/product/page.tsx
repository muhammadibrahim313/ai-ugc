"use client";

import { Instrument_Serif } from "next/font/google";
import { useRouter } from "next/navigation";

import { defineStepper } from "@/components/ui/stepper";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

import { ProductView } from "./components/product-view";
import { FinalVideoView } from "./components/final-video-view";
import { StoryboardView } from "./components/storyboard-view";
import { ProductContextProvider } from "./contexts/product-context";
import { MarketStrategyView } from "./components/market-strategy-view";
/* Commenting out influencers page as it's not needed at the moment */
// import { InfluencersView } from "./components/influencers-view";

const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });

export default function StepperDemo() {
  const router = useRouter();

  const {
    StepperProvider,
    StepperNavigation,
    StepperPanel,
    StepperStep,
    StepperTitle,
  } = defineStepper(
    { index: 0, id: "product", title: "Product" },
    { index: 1, id: "market-strategy", title: "Market Strategy" },
    /* Commenting out influencers step as it's not needed at the moment */
    // { index: 2, id: "influencers", title: "Influencers" },
    { index: 3, id: "storyboard", title: "Storyboard" },
    { index: 5, id: "final-video", title: "Final Video" },
  );

  return (
    <ProductContextProvider>
      <StepperProvider
        className="space-y-4 w-full"
        variant="horizontal"
        style={
          {
            "--step-circle-size": "0.55rem",
            "--step-circle-font-size": "0.5rem",
          } as React.CSSProperties
        }
      >
        {({ methods }) => (
          <div className="flex flex-col gap-4 p-4 w-full">
            <div className="flex items-center justify-between gap-2">
              <StepperNavigation className="w-full flex items-center bg-background/30 py-1.5 px-2 rounded-md border border-sidebar-border shadow-sm">
                <div className="flex gap-3 overflow-x-auto no-scrollbar">
                  {methods.all.map((step) => (
                    <StepperStep
                      key={step.id}
                      of={step.id}
                      onClick={() => methods.goTo(step.id)}
                      disabled={step.index > methods.current.index}
                      className={cn(
                        "px-2 py-1 rounded-md transition-all duration-200 text-xs min-w-0",
                        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground",
                        "focus-visible:ring-1 focus-visible:ring-sidebar-ring focus-visible:outline-none",
                        "flex items-center justify-center",
                      )}
                    >
                      <StepperTitle
                        className={cn(
                          instrumentSerif.className,
                          "text-sm font-medium truncate tracking-normal",
                        )}
                      >
                        {step.title}
                      </StepperTitle>
                    </StepperStep>
                  ))}
                </div>
              </StepperNavigation>

              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0"
                onClick={() => {
                  if (methods.current.id === "final-video") {
                    router.push("/");
                  } else {
                    methods.next();
                  }
                }}
                size="sm"
              >
                <span className="mr-1 text-xs">
                  {methods.current.id === "final-video" ? "Finish" : "Next"}
                </span>
                {methods.current.id === "final-video" ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <ArrowRight className="h-3 w-3" />
                )}
              </Button>
            </div>

            <StepperPanel
              className={cn(
                "min-h-[350px] rounded-md border-none bg-background/30 py-1",
                "shadow-sm transition-all duration-200",
              )}
            >
              {methods.switch({
                product: () => <ProductView />,
                "market-strategy": () => <MarketStrategyView />,
                /* Commenting out influencers case as it's not needed at the moment */
                // influencers: () => <InfluencersView />,
                storyboard: () => <StoryboardView />,
                "final-video": () => <FinalVideoView />,
              })}
            </StepperPanel>
          </div>
        )}
      </StepperProvider>
    </ProductContextProvider>
  );
}
