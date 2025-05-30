import { useCart } from "@/hooks/useCart";
import { useQuickView } from "@/hooks/useQuickView";
import { Product } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import { useWindowSize } from "@uidotdev/usehooks";
import Image from "next/image";
import React from "react";

export default function ProductHotspotCard({
  isActive,
  odd,
  product,
  hasOptions,
}: {
  isActive: boolean;
  odd: boolean;
  product: Product;
  hasOptions: boolean;
}) {
  const { addProductToCart } = useCart();
  const { openQuickView } = useQuickView();
  const { width } = useWindowSize();
  const isMobile = width && width < 768;

  const chosenSize = product.sizes?.[0];
  const chosenColor = product.sizes?.[0]?.colors?.[0];

  // Handle add to cart logic here
  const handleAddToCart = (product: Product) => {
    addProductToCart(
      product,
      1,
      product.sizes[0]?.value || "",
      product.sizes?.[0]?.colors?.[0]?.name || ""
    );
  };

  // Handle Quick View logic here
  const handleQuickView = (product: Product) => {
    openQuickView(product, chosenSize, chosenColor);
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
      <div
        className={cn(
          "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-transparent rounded-full border-[6px] border-white transition-all duration-300 delay-300 ease-in-out cursor-pointer after:absolute after:content-[''] after:-top-3 after:-left-3 after:w-8 after:h-8 after:bg-transparent after:animate-scale after:border-2 after:border-white/60 after:rounded-full",
          isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
        )}
        onClick={() => {
          if (isMobile) {
            handleQuickView(product);
          }
        }}
      >
        <div
          className={cn(
            "hidden absolute top-1/2 -translate-y-1/2 min-w-max md:flex items-center justify-center bg-[#fff] gap-4 p-4 pr-8 before:content-[''] before:absolute before:top-1/2 before:-translate-y-1/2  before:w-0 before:h-0 before:bg-transparent before:rotate-45  before:border-[5px] before:border-[#FFF] before:border-t-transparent before:border-r-transparent transition-all duration-150 ease-in-out delay-700",
            odd
              ? "right-10 before:-right-[5px] before:rotate-[225deg]"
              : "left-10 before:-left-[5px]",
            isActive ? "opacity-100 scale-100" : "opacity-0 scale-75"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gray-100 h-[80px] flex items-center justify-center">
            <Image
              src={product.images[0].formats.thumbnail.url}
              alt={product.images[0].alternativeText}
              width={product.images[0].formats.thumbnail.width}
              height={product.images[0].formats.thumbnail.height}
              quality={100}
              className="object-cover object-center h-full w-full"
            />
          </div>
          <div className="space-y-1">
            <a
              href={`/products/${product.slug}`}
              className="text-sm font-light font-barlow pointer-events-auto"
            >
              {product.name}
            </a>
            <div className="flex items-center space-x-2 font-barlow">
              <p className="text-sm">${product.price}</p>
              {/* view quick view if has option otherwise view add to cart */}
              {hasOptions ? (
                <button
                  className="text-sm font-light underline underline-offset-2 text-primary/50 hover:text-primary pointer-events-auto"
                  onClick={() => handleQuickView(product)}
                >
                  Quick View
                </button>
              ) : (
                <button
                  className="text-sm font-light underline underline-offset-2 text-primary/50 hover:text-primary pointer-events-auto"
                  onClick={() => {
                    handleAddToCart(product);
                  }}
                >
                  + Add to cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
