"use client";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useFeaturedProducts } from "@/hooks/useFeatured";
import ProductHotspotCard from "./ProductHotspotCard";

export default function FeaturedProductsSlider() {
  const { products, isLoading } = useFeaturedProducts();
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  // Determine if the products have size or color options or not
  const hasOptions = products.map((product) => {
    return (
      product.sizes.length > 1 ||
      product.sizes.some(
        (size) => Array.isArray(size.colors) && size.colors.length > 1
      )
    );
  });

  return (
    <div className="relative h-[700px] w-full overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-300 animate-pulse"></div>
      )}
      {products.map((product, index) => {
        const isActive = index === current;
        const odd = index % 2 === 0;
        return (
          <div
            key={product.id}
            className={cn(
              "absolute inset-0 transition-all duration-700 ease-in-out",
              isActive ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-95"
            )}
          >
            <Image
              src={product.featuredBannerImg.url}
              alt={product.featuredBannerImg.alternativeText}
              fill
              quality={100}
              className="object-cover object-center"
            />
            {/* Hotspot component */}
            <ProductHotspotCard
              isActive={isActive}
              odd={odd}
              product={product}
              hasOptions={hasOptions[index]}
            />
          </div>
        );
      })}

      <div className="absolute bottom-5 left-10 grid grid-cols-2 md:grid-cols-3 backdrop-blur bg-white z-20">
        <span className="hidden md:inline-flex justify-center items-center h-14 text-xs tracking-[1px] font-semibold uppercase col-span-3 border-b border-border">
          Shop the look
        </span>
        <button
          onClick={prevSlide}
          className="group text-sm font-light px-4 w-14 h-14 border-r border-border"
        >
          <ArrowLeft className="w-4 h-4 mr-1 inline" />
          <div className="sr-only">Previous</div>
        </button>
        <span className="hidden md:inline-flex justify-center items-center w-14 h-14 text-sm font-light text-center col-span-1 border-r border-border">
          {current + 1} / {products.length}
        </span>
        <button onClick={nextSlide} className="text-sm font-light w-14 h-14">
          <ArrowRight className="w-4 h-4 mr-1 inline" />
          <div className="sr-only">Next</div>
        </button>
      </div>
    </div>
  );
}
