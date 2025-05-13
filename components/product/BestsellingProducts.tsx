"use client";
import { useState } from "react";
import GenderFilter from "./GenderFilter";
import { useBestsellingProducts } from "@/hooks/useBestSellings";
import ProductCard from "./ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export default function BestsellingProducts() {
  const [gender, setGender] = useState<string>("men");
  const { products, isLoading } = useBestsellingProducts(gender);

  return (
    <section className="container py-16 space-y-8">
      <div className="space-y-4">
        <h2 className="text-4xl font-jost font-light text-center uppercase tracking-tight">
          BestSelling Watches
        </h2>
      </div>
      <GenderFilter gender={gender} setGender={setGender} />
      {isLoading ? (
        <div className="min-h-[400px] grid place-items-center">
          <div className="text-center space-y-4">
            <div className="w-10 h-10 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-500">Loading products...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid auto-cols-[52vw] md:auto-cols-[35vw] grid-cols-none grid-flow-col gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide lg:hidden">
            {products.map((product) => (
              <div key={product.id} className="snap-center snap-always">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          {/* Visible on screens > 1024px */}
          <Carousel
            className="w-full hidden lg:flex"
            opts={{ align: "start", slidesToScroll: 3 }}
          >
            <CarouselContent className="-ml-6">
              {products.map((product) => {
                return (
                  <CarouselItem
                    key={product.id}
                    className={cn(
                      "pl-6 md:basis-1/2 lg:basis-1/3 animate-in fade-in duration-1000 transition-transform ease-in-out will-change-transform"
                    )}
                  >
                    <ProductCard product={product} />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="w-14 h-14 rounded-none -left-7 top-[calc(50%-25px)] shadow-none disabled:hidden" />
            <CarouselNext className="w-14 h-14 rounded-none -right-7 top-[calc(50%-25px)] shadow-none disabled:hidden" />
          </Carousel>
        </>
      )}
    </section>
  );
}
