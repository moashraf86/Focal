import React, { useEffect, useState } from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Product } from "@/lib/definitions";
import Image from "next/image";
import ProductPrice from "../product/ProductPrice";
import ProductSizeSelector from "../product/ProductSizeSelector";
import ColorSelector from "../product/ColorSelector";
import { useRouter, useSearchParams } from "next/navigation";
import QuantitySelector from "./QuantitySelector";
import ProductActions from "../product/ProductActions";

export default function QuickViewDrawer({
  isOpen,
  setIsOpen,
  product,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  product: Product | null;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const defaultSize = product?.sizes?.[0].value ?? "";
  const selectedSize = searchParams.get("size") || defaultSize;

  const defaultColor = product?.sizes?.[0].colors?.[0].name ?? "";
  const selectedColor = searchParams.get("color") || defaultColor;

  const allColors =
    product?.sizes?.find((size) => size.value === selectedSize)?.colors || [];

  const [quantity, setQuantity] = useState<number>(1);

  const selectedImage =
    allColors.find((color) => color.name === selectedColor)?.images?.[0]
      ?.formats?.small?.url ?? null;

  const { width } = useWindowSize();
  const isMobile = width && width < 768;

  useEffect(() => {
    // Set default URL params when the drawer is opened
    if (isOpen) {
      router.push(`?size=${selectedSize}&color=${selectedColor}`, {
        scroll: false,
      });
    } else {
      // Clear URL params when the drawer is closed
      const params = new URLSearchParams(window.location.search);
      params.delete("size");
      params.delete("color");
      router.push(`?${params.toString()}`, { scroll: false });
    }
  }, [isOpen, selectedSize, selectedColor, router]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className="min-w-[500px] max-h-[75vh] md:max-h-full overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="tracking-normal">
            {product && (
              <div className="flex md:hidden items-center gap-4">
                <Image
                  src={selectedImage || product.images[0].formats.small.url}
                  alt={product?.images[0].alternativeText || ""}
                  width="65"
                  height="80"
                  quality={100}
                  className="object-cover object-center"
                />
                <div className="space-y-1">
                  <a href={`/products/${product?.slug}`}>{product?.name}</a>
                  <div className="flex items-center gap-2">
                    <ProductPrice price={product?.price || 0} />
                    <a
                      href={`products/${product.slug}?size=${selectedSize}&color=${selectedColor}`}
                      className="capitalize text-sm md:text-base font-barlow font-light underline underline-offset-2 decoration-primary/50 text-primary/70 hover:text-primary hover:decoration-primary"
                    >
                      View details
                    </a>
                  </div>
                </div>
              </div>
            )}
            <span className="hidden md:block">Choose options</span>
          </SheetTitle>
        </SheetHeader>
        {product && (
          <div className="flex flex-col gap-4 md:gap-8 mt-4 md:mt-8">
            <div className="hidden md:flex items-center gap-4 px-6 md:px-10">
              <Image
                src={selectedImage || product.images[0].formats.small.url}
                alt={product.images[0].alternativeText || ""}
                width={product.images[0].formats.thumbnail.width || 0}
                height={product.images[0].formats.thumbnail.height || 0}
                quality={100}
                className="object-cover object-center"
              />
              <div className="space-y-2">
                <a
                  href="#"
                  className="font-light font-barlow hover:underline underline-offset-2"
                >
                  {product.name}
                </a>
                <ProductPrice price={product?.price || 0} />
              </div>
            </div>
            <div className="px-6 md:px-10 space-y-4">
              <ProductSizeSelector
                sizes={product.sizes || []}
                defaultColor={defaultColor || ""}
              />
              <ColorSelector
                colors={allColors}
                selectedColors={[selectedColor]}
                mode="single"
              />
              <div className="space-y-1">
                <span>Quantity:</span>
                <QuantitySelector
                  quantity={quantity}
                  setQuantity={setQuantity}
                  mode="product"
                />
              </div>
            </div>
            <div className="pt-4 px-6 md:px-10 border-t border-border md:border-none md:pt-0">
              <ProductActions
                product={product}
                quantity={quantity}
                selectedSize={searchParams.get("size") || defaultSize}
                color={searchParams.get("color") || defaultColor}
              />
            </div>
            <div className="flex items-center justify-center">
              <a
                href={`products/${product.slug}?size=${selectedSize}&color=${selectedColor}`}
                className="hidden md:inline-block font-barlow font-light underline underline-offset-2 decoration-primary/50 text-primary/70 hover:text-primary hover:decoration-primary"
              >
                View details
              </a>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
