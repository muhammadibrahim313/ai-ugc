"use client";

import React from "react";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ProductInfo as ProductInfoResponse } from "@/app/[productUrl]/product/contexts/modules/product-info";
import { Skeleton } from "@/components/ui/skeleton";

export type ProductInfoProps = {
  product?: ProductInfoResponse;
};

export function ProductInfo({ product }: ProductInfoProps) {
  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          {product === undefined ? (
            <Skeleton className="w-20 h-8" />
          ) : (
            <Badge variant="secondary" className="text-xs font-normal">
              {product.category}
            </Badge>
          )}
          {product === undefined ? (
            <Skeleton className="w-20 h-8" />
          ) : (
            product.inStock !== undefined &&
            (product.inStock ? (
              <Badge variant="outline" className="text-xs font-normal text-green-600 bg-green-50 border-green-200">
                In Stock
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs font-normal text-red-600 bg-red-50 border-red-200">
                Out of Stock
              </Badge>
            ))
          )}
        </div>

        {product === undefined ? (
          <Skeleton className="h-8" />
        ) : (
          <h1 className="text-2xl font-medium">
            {product.brand} {product.name}
          </h1>
        )}

        {/* Rating and Price */}
        {product === undefined ? (
          <Skeleton className="h-20" />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-4 h-4",
                      i < Math.floor(product.rating?.score ?? 0)
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-200",
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.rating?.count.toLocaleString() ?? 0} reviews)
              </span>
            </div>
            <span className="text-2xl font-semibold text-foreground">
              {product.price}
            </span>
          </div>
        )}
      </div>

      {/* Description and Tags */}
      {product === undefined ? (
        <Skeleton className="h-20" />
      ) : (
        <div className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs font-normal bg-background/50">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Features */}
      {product === undefined ? (
        <Skeleton className="h-[200px]" />
      ) : (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-foreground/90">Key Features</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {product.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm">
                <div className="w-1 h-1 rounded-full bg-primary/40 mt-1.5" />
                <span className="text-foreground/80">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Specifications */}
      {product === undefined ? (
        <Skeleton className="h-[300px]" />
      ) : (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-foreground/90">Technical Specifications</h2>
          <Table>
            <TableBody>
              {Object.entries(product.specifications).map(([label, value]) => (
                <TableRow key={label} className="border-border/40">
                  <TableCell className="text-muted-foreground font-medium py-2 text-sm">
                    {label}
                  </TableCell>
                  <TableCell className="text-right py-2 text-sm">
                    {value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </motion.div>
  );
}
