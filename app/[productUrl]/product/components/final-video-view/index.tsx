"use client";

import { useEffect, useMemo, useState } from "react";

import { VideoPlayer } from "@/app/components/video-player";
import { Badge } from "@/components/ui/badge";

import { AdDetails } from "./components/ad-details";
import { useProductContext } from "../../contexts/product-context";
import { LoadingScreen } from "./components/loading-screen";
import { Skeleton } from "@/components/ui/skeleton";

export function FinalVideoView() {
  const [loading, setLoading] = useState(true);

  const {
    product: { data: productInfo },
    finalVideo: { refetch, data: finalVideoData },
  } = useProductContext();

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    setLoading(finalVideoData === undefined);
  }, [finalVideoData]);

  const handleShare = () => {
    console.log("Sharing video...");
  };

  const adDetails = useMemo(() => {
    if (finalVideoData === undefined) return undefined;

    return {
      title: `${productInfo?.name} Video Ad`,
      duration: new Date(finalVideoData.video_details.duration * 1000)
        .toISOString()
        .slice(11, 19),
      resolution: `${finalVideoData.video_details.resolution.width} × ${finalVideoData.video_details.resolution.height}`,
      format: finalVideoData.video_details.fileFormat,
      frameRate: finalVideoData.video_details.framerate,
    };
  }, [productInfo, finalVideoData]);

  return (
    <>
      <LoadingScreen loading={loading} setLoading={setLoading} />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Main content in reverse order on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Video section - more prominent on desktop */}
          <div className="lg:col-span-5 lg:order-1 order-1 flex flex-col">
            <div className="bg-black rounded-lg border border-sidebar-border overflow-hidden shadow-lg">
              <div style={{ aspectRatio: "9/16" }} className="relative">
                {finalVideoData === undefined ? (
                  <Skeleton className="w-full h-full absolute inset-0" />
                ) : (
                  <VideoPlayer videoUrl={finalVideoData.video_url} />
                )}
              </div>
            </div>
          </div>

          {/* Details section */}
          <div className="lg:col-span-7 lg:order-2 order-2">
            <div className="bg-background/50 rounded-lg border border-sidebar-border p-6">
              <h3 className="text-lg font-medium mb-4">Video Details</h3>

              {adDetails === undefined ? (
                <div className="space-y-3">
                  <Skeleton className="w-full h-8" />
                  <Skeleton className="w-full h-24" />
                  <Skeleton className="w-full h-32" />
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Metadata</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-muted/50 p-3 rounded-md">
                        <p className="text-xs text-muted-foreground mb-1">Duration</p>
                        <p className="text-sm font-medium">{adDetails.duration}</p>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-md">
                        <p className="text-xs text-muted-foreground mb-1">Format</p>
                        <p className="text-sm font-medium">{adDetails.format}</p>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-md">
                        <p className="text-xs text-muted-foreground mb-1">Resolution</p>
                        <p className="text-sm font-medium">{adDetails.resolution}</p>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-md">
                        <p className="text-xs text-muted-foreground mb-1">Frame Rate</p>
                        <p className="text-sm font-medium">{adDetails.frameRate} fps</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="p-4 bg-muted/40 rounded-md">
                      <h3 className="text-base font-medium mb-2">{adDetails.title}</h3>
                      <Badge className="mb-3">TikTok</Badge>
                    </div>
                  </div>

                  <AdDetails details={adDetails} onShare={handleShare} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
