"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { RainbowButton } from "../magicui/rainbow-button";

interface PixelData {
  x: number;
  y: number;
  r: number;
  color: string;
}

interface PixelPoint {
  x: number;
  y: number;
  color: [number, number, number, number];
}

export function PlaceholdersAndVanishInput({
  placeholders,
  onChange,
  onSubmit,
}: {
  placeholders: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [value, setValue] = useState("");
  const [animating, setAnimating] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const newDataRef = useRef<PixelData[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Placeholder rotation logic
  const startAnimation = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
  }, [placeholders.length]);

  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState !== "visible") {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = null;
    } else {
      startAnimation();
    }
  }, [startAnimation]);

  useEffect(() => {
    startAnimation();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [startAnimation, handleVisibilityChange]);

  // Canvas drawing logic
  const draw = useCallback(() => {
    if (!inputRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Setup canvas
    canvas.width = 800;
    canvas.height = 800;
    ctx.clearRect(0, 0, 800, 800);

    // Text rendering setup
    const computedStyles = getComputedStyle(inputRef.current);
    const fontSize = parseFloat(computedStyles.getPropertyValue("font-size"));
    ctx.font = `${fontSize * 2}px ${computedStyles.fontFamily}`;
    ctx.fillStyle = "#FFF";
    ctx.fillText(value, 16, 40);

    // Extract pixel data
    const imageData = ctx.getImageData(0, 0, 800, 800);
    const pixelData = imageData.data;
    const newData: PixelPoint[] = [];

    // Collect non-transparent pixels
    for (let y = 0; y < 800; y++) {
      const rowOffset = 4 * y * 800;
      for (let x = 0; x < 800; x++) {
        const pixelOffset = rowOffset + 4 * x;
        if (
          pixelData[pixelOffset] ||
          pixelData[pixelOffset + 1] ||
          pixelData[pixelOffset + 2]
        ) {
          newData.push({
            x,
            y,
            color: [
              pixelData[pixelOffset],
              pixelData[pixelOffset + 1],
              pixelData[pixelOffset + 2],
              pixelData[pixelOffset + 3],
            ],
          });
        }
      }
    }

    // Convert to particle data
    newDataRef.current = newData.map(({ x, y, color }) => ({
      x,
      y,
      r: 1,
      color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`,
    }));
  }, [value]);

  useEffect(() => {
    draw();
  }, [value, draw]);

  // Particle animation
  const animate = useCallback((startX: number) => {
    const animateFrame = (pos: number = 0) => {
      requestAnimationFrame(() => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        // Update particles
        const updatedParticles = newDataRef.current.filter((particle) => {
          if (particle.x < pos) return true;
          if (particle.r <= 0) return false;

          // Update particle position and size
          particle.x += Math.random() > 0.5 ? 1 : -1;
          particle.y += Math.random() > 0.5 ? 1 : -1;
          particle.r -= 0.05 * Math.random();
          return true;
        });

        // Render frame
        ctx.clearRect(pos, 0, 800, 800);
        updatedParticles.forEach(({ x, y, r, color }) => {
          if (x > pos) {
            ctx.beginPath();
            ctx.rect(x, y, r, r);
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            ctx.stroke();
          }
        });

        newDataRef.current = updatedParticles;

        if (updatedParticles.length > 0) {
          animateFrame(pos - 8);
        } else {
          setValue("");
          setAnimating(false);
        }
      });
    };

    animateFrame(startX);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !animating) {
      vanishAndSubmit();
    }
  };

  const vanishAndSubmit = useCallback(() => {
    if (!value) return;

    setAnimating(true);
    draw();

    const maxX = Math.max(...newDataRef.current.map((p) => p.x), 0);
    animate(maxX);
  }, [value, draw, animate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    vanishAndSubmit();
    onSubmit(e);
  };

  return (
    <form
      className={cn(
        "w-full relative max-w-xl mx-auto h-12 rounded-lg overflow-hidden",
        "bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm",
        "shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)]",
        "transition duration-200 hover:shadow-md focus-within:shadow-md",
        value && "bg-gray-50/80 dark:bg-zinc-900/80",
      )}
      onSubmit={handleSubmit}
    >
      <canvas
        className={cn(
          "absolute pointer-events-none text-base transform scale-50 top-[20%] left-2 sm:left-8",
          "origin-top-left filter invert dark:invert-0 pr-20",
          animating ? "opacity-100" : "opacity-0",
          "transition-opacity duration-200",
        )}
        ref={canvasRef}
      />

      <input
        ref={inputRef}
        value={value}
        type="text"
        onChange={(e) => {
          if (!animating) {
            setValue(e.target.value);
            onChange(e);
          }
        }}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full relative text-sm sm:text-base z-50",
          "border-none bg-transparent",
          "text-black dark:text-white",
          "h-full rounded-lg",
          "focus:outline-none focus:ring-0",
          "pl-4 sm:pl-6 pr-28",
          "placeholder:text-muted-foreground/60",
          animating && "text-transparent dark:text-transparent",
          "transition-colors duration-200",
        )}
      />

      <RainbowButton
        disabled={!value}
        type="submit"
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2",
          "h-8 w-24 z-50 rounded-md",
          "transition-transform duration-200",
          "hover:scale-[1.02] active:scale-[0.98]",
        )}
      >
        Generate
      </RainbowButton>

      <div className="absolute inset-0 flex items-center rounded-lg pointer-events-none">
        {/* <AnimatePresence mode="wait"> */}
        {!value && (
          <motion.p
            key={`placeholder-${currentPlaceholder}`}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -15, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
              "text-sm sm:text-base font-normal",
              "text-neutral-500 dark:text-zinc-500",
              "pl-4 sm:pl-6 text-left",
              "w-[calc(100%-2rem)] truncate",
            )}
          >
            {placeholders[currentPlaceholder]}
          </motion.p>
        )}
        {/* </AnimatePresence> */}
      </div>
    </form>
  );
}
