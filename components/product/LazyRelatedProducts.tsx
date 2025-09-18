"use client";

import { useIntersectionObserver } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { Suspense } from "react";
import RelatedProducts from "./RelatedProducts";
import { Product } from "@/lib/definitions";
import RelatedProductsSkeleton from "./RelatedProductsSkelton";

// Enhanced LazyRelatedProducts.tsx
export default function LazyRelatedProducts({
  categories,
  face,
  product,
}: {
  categories: string | string[];
  face?: string;
  product?: Product;
}) {
  const [shouldLoad, setShouldLoad] = useState(false);

  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "0px",
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      setShouldLoad(true);
    }
  }, [entry]);

  return (
    <div ref={ref} className="min-h-[400px]">
      {shouldLoad ? (
        <Suspense fallback={<RelatedProductsSkeleton />}>
          <RelatedProducts
            categories={categories}
            face={face}
            product={product}
          />
        </Suspense>
      ) : (
        <RelatedProductsSkeleton />
      )}
    </div>
  );
}
