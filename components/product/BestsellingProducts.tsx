"use client";
import { useEffect, useState, useTransition } from "react";
import ProductCard from "./ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { fetchBestsellingProducts } from "@/lib/data";
import Link from "next/link";
import { Product } from "@/lib/definitions";
import GenderFilter from "./GenderFilter";

export default function BestsellingProducts() {
  const [gender, setGender] = useState<"men" | "women">("men");
  const [products, setProducts] = useState<Product[]>([]);
  const [isPending, startTransition] = useTransition();

  // Server action handler
  const handleGenderChange = (newGender: "men" | "women") => {
    setGender(newGender);

    startTransition(async () => {
      const { products } = await fetchBestsellingProducts(newGender);
      setProducts(products);
    });
  };

  // on mount, fetch best selling products for men
  useEffect(() => {
    handleGenderChange("men");
  }, []);

  return (
    <section className="container py-16 space-y-8">
      <div className="space-y-4">
        <h2 className="text-4xl font-jost font-light text-center uppercase tracking-tight">
          BestSelling Watches
        </h2>
      </div>

      <div className="flex justify-center">
        <GenderFilter gender={gender} setGender={handleGenderChange} />
      </div>

      {isPending ? (
        <div className="min-h-[600px] grid place-items-center">
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
              {products.map((product) => (
                <CarouselItem
                  key={product.id}
                  className={cn(
                    "pl-6 md:basis-1/2 lg:basis-1/3 animate-in fade-in duration-1000 transition-transform ease-in-out will-change-transform"
                  )}
                >
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="w-14 h-14 rounded-none -left-7 top-[calc(50%-25px)] shadow-none disabled:hidden" />
            <CarouselNext className="w-14 h-14 rounded-none -right-7 top-[calc(50%-25px)] shadow-none disabled:hidden" />
          </Carousel>

          <div className="flex justify-center mt-4">
            <Button asChild variant="emphasis" size="lg">
              <Link href={`/categories/${gender}`}>
                View All {gender.charAt(0).toUpperCase() + gender.slice(1)}
              </Link>
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
