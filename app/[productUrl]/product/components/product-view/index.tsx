import { useEffect } from "react";

import { ProductGallery } from "./components/product-gallery";
import { ProductInfo } from "./components/product-info";
import { useProductContext } from "../../contexts/product-context";

export function ProductView() {
  const {
    product: { refetch, data },
  } = useProductContext();

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-y-8 md:gap-x-10 bg-background/40 rounded-lg">
      <div className="md:col-span-5">
        <ProductGallery images={data?.top3ImageUrls} />
      </div>
      <div className="md:col-span-7">
        <ProductInfo product={data} />
      </div>
    </div>
  );
}
