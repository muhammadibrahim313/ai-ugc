import { motion } from "framer-motion";
import { Camera, Film } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface AdScene {
  id: number;
  roll_type: "A-roll" | "B-roll";
  content: string;
  description: string;
}

export function AdSceneCard({
  scene,
  index,
}: {
  scene: AdScene;
  index: number;
}) {
  return (
    <motion.div
      className="bg-background/30 rounded-lg border border-sidebar-border overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      {/* Header with badge and scene number */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-sidebar-border/50 bg-muted/20">
        <Badge
          variant={scene.roll_type === "A-roll" ? "default" : "secondary"}
          className="flex items-center gap-1 text-xs"
        >
          {scene.roll_type === "A-roll" ? (
            <Camera className="w-3 h-3" />
          ) : (
            <Film className="w-3 h-3" />
          )}
          {scene.roll_type}
        </Badge>

        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
          {index + 1}
        </div>
      </div>

      {/* Content section */}
      <div className="p-4 space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-1 flex items-center gap-1.5">
            Script
          </h3>
          <p className="text-sm">{scene.content}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-1 flex items-center gap-1.5">
            Direction
          </h3>
          <p className="text-sm text-muted-foreground">{scene.description}</p>
        </div>
      </div>
    </motion.div>
  );
}
