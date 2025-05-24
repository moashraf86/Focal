"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import { fetchRelatedProducts } from "@/lib/data";
import { Product } from "@/lib/definitions";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

export default function RelatedProducts({
  category,
  face,
  product,
}: {
  category: string;
  face?: string;
  product?: Product;
}) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!category) return;

    const fetchData = async () => {
      try {
        const response = await fetchRelatedProducts(category, face);
        const filtered = product
          ? response.products.filter((p) => p.id !== product.id)
          : response.products;
        setRelatedProducts(filtered);
      } catch (error) {
        console.error("Failed to fetch related products:", error);
      }
    };

    fetchData();
  }, [category, face, product]);

  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
    <section className="container max-w-screen-xl mb-20 space-y-10">
      <h2
        className="text-3xl md:text-4xl lg:text-5xl text-center font-light uppercase leading-tight tracking-tight"
        aria-label={`More products like ${product?.name}`}
      >
        Available styles
      </h2>

      {/* Mobile: horizontal scroll */}
      <div className="grid auto-cols-[52vw] md:auto-cols-[35vw] grid-cols-none grid-flow-col gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide lg:hidden">
        {relatedProducts.map((product) => (
          <div key={product.id} className="snap-center snap-always">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Desktop: carousel */}
      <Carousel
        className="w-full hidden lg:flex"
        opts={{ align: "start", slidesToScroll: 4 }}
      >
        <CarouselContent className="-ml-6">
          {relatedProducts.map((product) => (
            <CarouselItem
              key={product.id}
              className="pl-6 md:basis-1/2 lg:basis-1/4"
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="w-14 h-14 rounded-none -left-7 top-[calc(50%-25px)] shadow-none disabled:hidden" />
        <CarouselNext className="w-14 h-14 rounded-none -right-7 top-[calc(50%-25px)] shadow-none disabled:hidden" />
      </Carousel>
    </section>
  );
}
