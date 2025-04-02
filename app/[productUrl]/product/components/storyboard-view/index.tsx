"use client";

import { useEffect } from "react";
import { AdSceneList } from "./components/ad-scene-list";
import { useProductContext } from "../../contexts/product-context";
import { Skeleton } from "@/components/ui/skeleton";

export function StoryboardView() {
  const {
    storyboard: { refetch, data },
  } = useProductContext();

  useEffect(() => {
    console.log(data);
    refetch();
  }, [refetch]);

  const handleAddScene = () => {
    console.log("Adding new scene");
  };

  return (
    <div className="space-y-6">
      {data === undefined ? (
        <div className="space-y-8">
          {[1, 2, 3].map((index) => (
            <div key={index} className="rounded-lg border p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg">
          <AdSceneList
            scenes={data.structured_script!.map((scene, index: number) => ({
              id: index,
              roll_type: scene.roll_type,
              content: scene.content,
              description: scene.description,
            }))}
            onAddScene={handleAddScene}
          />
        </div>
      )}
    </div>
  );
}
