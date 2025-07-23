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

  const defaultSize = useMemo(
    () => selectedSize ?? getInitialSize(product),
    [product, selectedSize]
  );
  const defaultColor = useMemo(
    () => selectedColor ?? getInitialColor(product),
    [product, selectedColor]
  );

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
      selectedColorObj?.images?.[0]?.formats?.small ||
      product.images?.[0]?.formats?.small ||
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  if (!product) return null;

  // Handle size change and update available colors
  const handleSizeChange = (size: string) => {
    const newColors = getAvailableColors(product, size);
    updateState({
      selectedSize: size,
      selectedColor: newColors[0]?.name || "",
    });
  };

  // set href for quick view
  const href =
    selectedSize && selectedSize !== "free"
      ? `/products/${product.slug}?size=${selectedSize}&color=${selectedColor}`
      : selectedSize === "free" && selectedColor
        ? `/products/${product.slug}?color=${selectedColor}`
        : `/products/${product.slug}`;

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
              src={selectedImage?.url || "/fallback-image.jpg"}
              alt={selectedImage?.hash || "Product image"}
              width={120}
              height={120}
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

          <div className="px-6 md:px-10 space-y-4">
            {selectedSize !== "free" && (
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
                colors={allColors}
                selectedColors={[selectedColor]}
                onColorSelect={(colorName) =>
                  updateState({ selectedColor: colorName })
                }
              />
            </div>

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
