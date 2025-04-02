"use client";

import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn } from "lucide-react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export type ProductGalleryProps = {
  images?: string[];
};

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  return images === undefined ? (
    <Skeleton className="w-full h-[500px]" />
  ) : (
    <div className="space-y-5">
      <motion.div
        className={cn(
          "relative aspect-square rounded-lg overflow-hidden",
          "bg-background/10 border border-border/60 shadow-sm",
          "group cursor-zoom-in",
          isZoomed && "cursor-zoom-out",
        )}
        onClick={() => setIsZoomed(!isZoomed)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedImage}
            src={images[selectedImage]}
            alt={`Product image ${selectedImage + 1}`}
            className={cn(
              "object-cover size-full transition-transform duration-300",
              isZoomed && "scale-150",
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        </AnimatePresence>

        <div
          className={cn(
            "absolute inset-0 bg-black/0 transition-colors",
            "flex items-center justify-center",
            isZoomed ? "opacity-0" : "group-hover:bg-black/5",
          )}
        >
          {!isZoomed && (
            <ZoomIn
              className={cn(
                "w-6 h-6 text-foreground/80 opacity-0 transition-opacity",
                "drop-shadow-sm",
                "group-hover:opacity-70",
              )}
            />
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-5 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={cn(
              "relative aspect-square rounded-md overflow-hidden transition-all duration-200",
              "border border-border/60 bg-background/10",
              "hover:border-primary/30 hover:shadow-sm",
              index === selectedImage && "ring-1 ring-primary/50 shadow-sm",
            )}
          >
            <img
              src={image}
              alt={`Product thumbnail ${index + 1}`}
              className="object-cover size-full"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
