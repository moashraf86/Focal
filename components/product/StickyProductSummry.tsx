"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import ProductActions from "./ProductActions";
import ProductPrice from "./ProductPrice";
import { Product } from "@/lib/definitions";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useProductVisibilitySubscription } from "@/hooks/useProductVisibility";
import { cn } from "@/lib/utils";
import { useWindowSize } from "@uidotdev/usehooks";

interface StickyProductSummaryProps {
  product: Product;
}

const StickyProductSummary: React.FC<StickyProductSummaryProps> = ({
  product,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const searchParams = useSearchParams();
  const URL = useRouter();
  const { width } = useWindowSize();
  const isMobile = width && width < 1024;

  useProductVisibilitySubscription((visible) => {
    setIsVisible(visible);
    setIsInitialized(true);
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const show = !isVisible && mounted && isInitialized;

  // Get all sizes
  const sizes = product.sizes?.map((size) => size.value) ?? [];
  const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0;
  const defaultSize = hasSizes ? product.sizes[0].value : "";
  const selectedSize = searchParams.get("size") ?? defaultSize;

  const defaultColor = hasSizes
    ? product?.sizes?.[0]?.colors?.[0]?.name
    : undefined;

  const selectedColor = searchParams.get("color") ?? defaultColor;
  const selectedImage =
    product.sizes
      ?.find((size) => size.value === selectedSize)
      ?.colors?.find((color) => color.name === selectedColor)?.images?.[0]
      ?.url ?? product.images[0].url;

  const handleSizeChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("size", value);
    URL.push(`?${params.toString()}`, { scroll: false });
  };

  const handleColorChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("color", value);
    URL.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      {!isMobile ? (
        <div
          id="sticky-product-summary"
          className={cn(
            "fixed bottom-0 lg:top-20 lg:bottom-auto left-0 right-0 z-40 bg-background shadow-sm items-center py-4 gap-4 border-b border-border transition-[transform,opacity] duration-300",
            show
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-20 pointer-events-none"
          )}
        >
          <div className="container max-w-screen-xl">
            <div className="hidden lg:flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Image
                  src={selectedImage}
                  alt={product.images[0].alternativeText ?? product.name}
                  width={56}
                  height={56}
                  className="object-contain"
                />
                <div className="flex-1 flex items-center gap-2">
                  <span className="font-barlow font-normal">
                    {product.name}
                  </span>
                  <span className="w-1 h-1 bg-gray-400" />
                  <div className="flex items-center gap-1 text-base font-normal font-barlow">
                    <ProductPrice
                      price={product.price}
                      className="text-base font-normal"
                    />
                    USD
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {hasSizes && (
                  <>
                    {selectedSize !== "free" && (
                      <Select
                        defaultValue={defaultSize}
                        onValueChange={handleSizeChange}
                        value={selectedSize}
                      >
                        <SelectTrigger className="h-12 min-w-24">
                          <SelectValue
                            placeholder={defaultSize}
                            className="text-base"
                          />
                        </SelectTrigger>
                        <SelectContent align="end" className="min-w-24">
                          {sizes.map((size) => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {selectedColor && (
                      <Select
                        defaultValue={defaultColor}
                        onValueChange={handleColorChange}
                        value={selectedColor}
                      >
                        <SelectTrigger className="h-12 min-w-40">
                          <SelectValue
                            placeholder={defaultColor}
                            className="text-base"
                          />
                        </SelectTrigger>
                        <SelectContent align="end" className="min-w-40">
                          {product.sizes
                            ?.find((size) => size.value === selectedSize)
                            ?.colors?.map((color) => (
                              <SelectItem key={color.name} value={color.name}>
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-5 h-5"
                                    style={{
                                      backgroundImage: `url(${color.pattern?.url})`,
                                      backgroundSize: "cover",
                                      backgroundPosition: "center",
                                      backgroundRepeat: "no-repeat",
                                    }}
                                  />
                                  {color.name}
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    )}
                  </>
                )}
                <ProductActions
                  product={product}
                  quantity={1}
                  selectedSize={selectedSize ?? ""}
                  color={selectedColor}
                />
              </div>
            </div>
            <div className="lg:hidden">
              <ProductActions
                product={product}
                quantity={1}
                selectedSize={selectedSize ?? ""}
                color={selectedColor}
              />
            </div>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "fixed bottom-0 lg:top-20 lg:bottom-auto left-0 right-0 z-40 bg-background shadow-sm items-center py-4 gap-4 border-b border-border transition-[transform,opacity] duration-300",
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          )}
        >
          <div className="container max-w-screen-xl">
            <ProductActions
              product={product}
              quantity={1}
              selectedSize={selectedSize ?? ""}
              color={selectedColor ?? ""}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default StickyProductSummary;
