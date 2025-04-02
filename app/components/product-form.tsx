"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PaperclipIcon, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SiShopify,
  SiAmazon,
  SiEtsy,
  SiEbay,
  SiWalmart,
  SiWoocommerce,
  SiSquarespace,
  SiWix,
  SiShopee,
  SiZalando
} from "react-icons/si";

// const PLACEHOLDER_LINKS = [
//   "https://a.co/d/fwhl29U",
//   "https://www.etsy.com/listing/624694625",
// ];

const PLATFORMS = [
  { name: "Shopify", icon: SiShopify },
  { name: "Amazon", icon: SiAmazon },
  { name: "Etsy", icon: SiEtsy },
  { name: "eBay", icon: SiEbay },
  { name: "Walmart", icon: SiWalmart },
  { name: "WooCommerce", icon: SiWoocommerce },
  { name: "Squarespace", icon: SiSquarespace },
  { name: "Wix", icon: SiWix },
  { name: "Shopee", icon: SiShopee },
  { name: "Zalando", icon: SiZalando }
];

const placeholders = [
  "Enter a product URL from Amazon, eBay, or any e-commerce site...",
  "Paste a link to your product to get started...",
  "Share your product URL to begin the analysis...",
];

export function ProductForm() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholders[0]);

  useEffect(() => {
    // Cycle through placeholders
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % placeholders.length;
      setCurrentPlaceholder(placeholders[currentIndex]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!inputValue.trim()) return;

    router.push(`/${encodeURIComponent(inputValue)}/product`);
  };

  return (
    <div className="flex flex-col justify-center items-center gap-6 max-w-3xl mx-auto w-full mt-5">
      <motion.div
        className="w-full max-w-xl relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="relative">
          <form
            onSubmit={handleSubmit}
            className="relative flex flex-col w-full rounded-md border border-input bg-background p-2 shadow-sm focus-within:ring-1 focus-within:ring-ring"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground mb-2"
              placeholder={currentPlaceholder}
            />
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 rounded-sm p-0 hover:bg-muted"
                >
                  <PaperclipIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="sr-only">Attach</span>
                </Button>
              </div>
              <Button
                type="submit"
                size="sm"
                className="h-6 w-6 rounded-sm bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!inputValue.trim()}
              >
                <ArrowUp className="h-4 w-4" />
                {/* <span className="text-xs">Generate</span> */}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>

      <motion.div
        className="w-full max-w-xl mt-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="h-px flex-grow bg-border/40"></div>
          <span className="text-xs text-muted-foreground font-medium">Works with all major product pages</span>
          <div className="h-px flex-grow bg-border/40"></div>
        </div>

        <div className="relative w-full overflow-hidden mt-2">
          <div className="flex gap-6 animate-scroll py-2">
            {[...PLATFORMS, ...PLATFORMS].map((platform, index) => (
              <div
                key={`${platform.name}-${index}`}
                className="flex flex-col items-center justify-center gap-1 min-w-[3rem]"
              >
                <platform.icon className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors duration-200" />
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 25s linear infinite;
        }
      `}</style>
    </div>
  );
}
