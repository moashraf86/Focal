import React, { useEffect, useMemo, useRef } from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Product } from "@/lib/definitions";
import Image from "next/image";
import ProductPrice from "../product/ProductPrice";
import QuantitySelector from "./QuantitySelector";
import ProductActions from "../product/ProductActions";
import { useQuickView } from "@/hooks/useQuickView";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function QuickViewDrawer({
  isOpen,
  product,
  onClose,
}: {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
}) {
  const { selectedSize, selectedColor, quantity, setQuantity, updateState } =
    useQuickView();
  const { width } = useWindowSize();
  const isMobile = width && width < 768;

  const defaultSize = useMemo(() => getInitialSize(product), [product]);
  const defaultColor = useMemo(() => getInitialColor(product), [product]);

  const allColors = useMemo(
    () => getAvailableColors(product, selectedSize),
    [product, selectedSize]
  );

  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    // Store previous pathname in ref
    const prevPathname = prevPathnameRef.current;
    prevPathnameRef.current = pathname;

    // Only close if pathname changed and drawer was open
    if (prevPathname !== pathname && isOpen) {
      onClose();
    }
  }, [pathname, isOpen, onClose]);

  // Get the image for the selected color or fallback to the first product image
  const selectedImage = useMemo(() => {
    if (!product) return null;
    const selectedColorObj = allColors.find((c) => c.name === selectedColor);
    return (
      selectedColorObj?.images?.[0].formats?.small?.url ||
      product.images?.[0]?.formats?.small?.url ||
      "/fallback-image.jpg"
    );
  }, [allColors, selectedColor, product]);

  // Set initial values when product changes
  useEffect(() => {
    if (product) {
      updateState({
        selectedSize: defaultSize,
        selectedColor: defaultColor,
        quantity: 1,
      });
    }
  }, [product?.id]);

  if (!product) return null;

  // Handle size change and update available colors
  const handleSizeChange = (size: string) => {
    const newColors = getAvailableColors(product, size);
    updateState({
      selectedSize: size,
      selectedColor: newColors[0]?.name || "",
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className="max-h-[75vh] md:max-h-full md:min-w-[500px] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="tracking-normal">
            {/* Mobile Header */}
            <div className="flex md:hidden items-center gap-4">
              <Image
                src={selectedImage || "/fallback-image.jpg"}
                alt={product.images[0]?.alternativeText || "Product image"}
                width={65}
                height={80}
                quality={100}
                className="object-cover object-center"
                priority
              />
              <div className="space-y-1">
                <Link
                  href={`/products/${product.slug}`}
                  className="font-barlow capitalize hover:underline"
                >
                  {product.name}
                </Link>
                <div className="flex items-center gap-2">
                  <ProductPrice price={product.price} />
                  <Link
                    href={`/products/${product.slug}?size=${selectedSize}&color=${selectedColor}`}
                    className="capitalize text-sm md:text-base font-barlow font-light underline underline-offset-2 decoration-primary/50 text-primary/70 hover:text-primary hover:decoration-primary"
                  >
                    View details
                  </Link>
                </div>
              </div>
            </div>
            <span className="hidden md:block">Choose options</span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 md:gap-8 mt-4 md:mt-8">
          {/* Desktop Image Section */}
          <div className="hidden md:flex items-center gap-4 px-6 md:px-10">
            <Image
              src={selectedImage || "/fallback-image.jpg"}
              alt={product.images[0]?.alternativeText || "Product image"}
              width={product.images[0]?.formats?.thumbnail?.width || 100}
              height={product.images[0]?.formats?.thumbnail?.height || 100}
              quality={100}
              className="object-cover object-center"
              priority
            />
            <div className="space-y-2">
              <Link
                href={`/products/${product.slug}`}
                className="font-barlow font-light hover:underline underline-offset-2"
              >
                {product.name}
              </Link>
              <ProductPrice price={product.price} />
            </div>
          </div>

          {/* Size Selector */}
          <div className="px-6 md:px-10 space-y-4">
            <div className="space-y-2">
              <span>Watch Sizes</span>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size.id}
                    variant="outline"
                    className={cn(
                      "text-sm font-normal lowercase h-12 shadow-none",
                      {
                        "border-2 border-primary bg-accent/50":
                          selectedSize === size.value,
                      }
                    )}
                    onClick={() => handleSizeChange(size.value)}
                  >
                    {size.value}
                  </Button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div className="space-y-2">
              <span>Strap Color</span>
              <div className="flex flex-wrap gap-2">
                {allColors.map((color) => (
                  <Button
                    key={color.name}
                    variant="outline"
                    title={color.name}
                    className={cn(
                      "relative w-9 h-9 p-[1px] border-0 shadow-none",
                      "after:absolute after:inset-[-3px] after:z-[-1]",
                      "after:border-2 after:transition-all after:duration-200",
                      {
                        "after:border-primary after:scale-100 after:opacity-100":
                          selectedColor === color.name,
                        "after:border-transparent after:scale-90 after:opacity-0":
                          selectedColor !== color.name,
                      }
                    )}
                    onClick={() => updateState({ selectedColor: color.name })}
                    aria-label={`Select ${color.name} color`}
                  >
                    <Image
                      src={color?.pattern?.url || "/fallback-pattern.jpg"}
                      alt={color?.pattern?.alternativeText || "Color pattern"}
                      width={32}
                      height={32}
                      className="object-cover w-full h-full"
                    />
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-1">
              <span>Quantity:</span>
              <QuantitySelector
                quantity={quantity}
                setQuantity={(newQty) => setQuantity(newQty)}
                mode="product"
              />
            </div>
          </div>

          {/* Product Actions */}
          <div className="pt-4 px-6 md:px-10 border-t border-border md:border-none md:pt-0">
            <ProductActions
              product={product}
              quantity={quantity}
              selectedSize={selectedSize}
              color={selectedColor}
            />
          </div>

          {/* Desktop Details Link */}
          <div className="flex items-center justify-center">
            <Link
              href={`/products/${product.slug}?size=${selectedSize}&color=${selectedColor}`}
              className="capitalize font-barlow hidden md:inline-block font-light underline text-primary/70 hover:text-primary"
            >
              View details
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Utilities (can be placed in a separate file)
function getInitialSize(product: Product | null) {
  return product?.sizes?.[0]?.value ?? "";
}
function getInitialColor(product: Product | null) {
  return product?.sizes?.[0]?.colors?.[0]?.name ?? "";
}
function getAvailableColors(product: Product | null, size: string) {
  return product?.sizes?.find((s) => s.value === size)?.colors || [];
}
