import React, { useEffect, useMemo, useRef } from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Product } from "@/lib/definitions";
import Image from "next/image";
import ProductPrice from "../product/ProductPrice";
import QuantitySelector from "./QuantitySelector";
import ProductActions from "../product/ProductActions";
import { useQuickView } from "@/hooks/useQuickView";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProductSizeSelector from "../product/ProductSizeSelector";
import ColorSelector from "../product/ColorSelector";
import { analyzeProductStructure, getColorsForSize } from "@/lib/helper";

export default function QuickViewDrawer({
  isOpen,
  product,
  onClose,
}: {
  isOpen: boolean;
  product: Product;
  onClose: () => void;
}) {
  const { selectedSize, selectedColor, quantity, setQuantity, updateState } =
    useQuickView();
  const { width } = useWindowSize();
  const isMobile = width && width < 768;

  const { hasActualSizes, actualSizes } = analyzeProductStructure(product);

  const currentSize = selectedSize ?? actualSizes[0]?.value ?? undefined;
  const availableColors = getColorsForSize(product, currentSize);
  const currentColor = selectedColor ?? availableColors[0]?.name ?? undefined;

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
    const selectedColorObj = availableColors.find(
      (c) => c.name === selectedColor
    );

    return (
      selectedColorObj?.images?.[0]?.formats?.small ||
      product.images?.[0]?.formats?.small ||
      "/fallback-image.jpg"
    );
  }, [availableColors, selectedColor, product]);

  // Set initial values when product changes
  useEffect(() => {
    if (product) {
      updateState({
        selectedSize: currentSize,
        selectedColor: currentColor,
        quantity: 1,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  if (!product) return null;

  // Handle size change and update available colors
  const handleSizeChange = (size: string) => {
    const newColors = getColorsForSize(product, size);
    updateState({
      selectedSize: size,
      selectedColor: newColors[0]?.name || undefined,
    });
  };

  // set href for quick view
  const params = new URLSearchParams();
  if (selectedSize) {
    params.append("size", selectedSize);
  }
  if (selectedColor) {
    params.append("color", selectedColor);
  }
  const queryString = params.toString();
  const href = `/products/${product.slug}${queryString ? `?${queryString}` : ""}`;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className="max-h-[75vh] md:max-h-full overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="tracking-normal">
            {/* Mobile Header */}
            <div className="flex md:hidden items-center gap-4">
              <Image
                src={selectedImage?.url || "/fallback-image.jpg"}
                alt={selectedImage?.hash || "Product image"}
                width={65}
                height={80}
                quality={80}
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
              src={selectedImage?.url || "/fallback-image.jpg"}
              alt={selectedImage?.hash || "Product image"}
              width={120}
              height={120}
              quality={80}
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

          <div className="px-6 md:px-10 space-y-4">
            {hasActualSizes && (
              <div className="space-y-2">
                <span>
                  {product.collections?.some((collection) =>
                    collection.slug.includes("strap")
                  )
                    ? "Strap width"
                    : "Watch size"}
                  : {selectedSize}
                </span>{" "}
                <ProductSizeSelector
                  sizes={product.sizes}
                  selectedSize={selectedSize}
                  onSizeChange={handleSizeChange}
                />
              </div>
            )}

            {selectedColor && (
              <div className="space-y-2">
                <span>
                  {product.collections?.some((collection) =>
                    collection.slug.includes("strap")
                  )
                    ? "Fastener"
                    : "Strap"}
                  : {selectedColor}
                </span>{" "}
                <ColorSelector
                  mode="single"
                  colors={availableColors}
                  selectedColors={[selectedColor]}
                  onColorSelect={(colorName) =>
                    updateState({ selectedColor: colorName })
                  }
                />
              </div>
            )}

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
              href={href}
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
