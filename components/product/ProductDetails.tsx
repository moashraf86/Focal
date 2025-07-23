"use client";
import ProductTitle from "./ProductTitle";
import ProductPrice from "./ProductPrice";
import QuantitySelector from "../shared/QuantitySelector";
import ProductActions from "./ProductActions";
import { Product, Color } from "@/lib/definitions";
import { useEffect, useState } from "react";
import ProductCarousel from "./ProductCarousel";
import ProductRating from "./ProductRating";
import ProductSizeSelector from "./ProductSizeSelector";
import ColorSelector from "./ColorSelector";
import { useRouter, useSearchParams } from "next/navigation";
import { useProductVisibilityObserver } from "@/hooks/useProductVisibility";
import useScrollToTop from "@/hooks/useScrollToTop";

export default function ProductDetails({
  product,
  initialQuantity = 1,
}: {
  product: Product;
  initialQuantity?: number;
}) {
  const searchParams = useSearchParams();
  const URL = useRouter();

  // --- Size logic ---
  const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0;
  const defaultSize = hasSizes ? product.sizes[0].value : undefined;
  const selectedSize = hasSizes
    ? searchParams.get("size") || defaultSize
    : undefined;

  // --- Color logic ---
  const sizeObj = hasSizes
    ? product.sizes.find((size) => size.value === selectedSize)
    : undefined;
  let colors: Color[] = [];
  if (sizeObj && Array.isArray(sizeObj.colors)) {
    colors = sizeObj.colors;
  }
  const hasColors = colors.length > 0;
  const defaultColor = hasColors ? colors[0].name : "";
  const selectedColor = hasColors
    ? searchParams.get("color") || defaultColor || ""
    : undefined;
  const allColors: Color[] = colors;

  // --- Carousel images ---
  const carouselImages =
    hasColors && selectedColor
      ? (allColors.find((color) => color.name === selectedColor)?.images ?? [])
      : (product.images ?? []);

  const [resetCarousel, setResetCarousel] = useState(false);
  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const intersectionRef = useProductVisibilityObserver();
  useScrollToTop();

  // Handle size change
  const handleSizeChange = (value: string) => {
    if (!hasSizes) return;
    // If colors exist for new size, pick first color
    const newSizeObj = product.sizes.find((size) => size.value === value);
    const newColor =
      newSizeObj && Array.isArray(newSizeObj.colors) && newSizeObj.colors.length
        ? newSizeObj.colors[0].name
        : undefined;
    if (hasColors && newColor) {
      URL.push(`?size=${value}&color=${newColor}`, { scroll: false });
    } else {
      URL.push(`?size=${value}`, { scroll: false });
    }
  };

  // Handle color change
  const handleColorChange = (value: string) => {
    if (!hasColors || !selectedSize) return;
    if (selectedSize === "free") {
      URL.push(`?color=${value}`, { scroll: false });
      return;
    }
    URL.push(`?size=${selectedSize}&color=${value}`, { scroll: false });
  };

  // Update carousel images when selected size or color changes
  useEffect(() => {
    setResetCarousel((prev) => !prev);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSize, selectedColor]);

  // Set default URL params on first render (only if sizes/colors exist)
  useEffect(() => {
    if (hasSizes && selectedSize !== "free" && selectedColor) {
      URL.push(`?size=${selectedSize}&color=${selectedColor}`, {
        scroll: true,
      });
    } else if (hasSizes && selectedSize === "free" && selectedColor) {
      URL.push(`?color=${selectedColor}`, { scroll: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedColorSafe =
    typeof selectedColor === "string" ? selectedColor : "";

  return (
    <section
      className="container max-w-screen-xl"
      ref={intersectionRef}
      id="product-details"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 mb-10 lg:mb-20">
        {/* Product Carousel */}
        <div className="lg:sticky lg:top-20 lg:col-span-7">
          <ProductCarousel
            images={carouselImages}
            className="lg:sticky lg:top-20 lg:col-span-7"
            resetCarousel={resetCarousel}
          />
        </div>
        {/* Product details */}
        <div className="space-y-6 lg:col-span-5">
          <div className="space-y-6 border-b border-border pb-4">
            <ProductTitle title={product.name} />
            <div className="flex items-center gap-1 text-lg lg:text-2xl  font-normal font-barlow">
              <ProductPrice
                price={product.price}
                className="text-lg lg:text-2xl font-barlow font-normal"
              />
              USD
            </div>
            <ProductRating rating={5} reviews={3} />
          </div>
          {/* Size Selector (only if sizes exist) */}
          {hasSizes && selectedSize && selectedSize !== "free" && (
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
          {/* Color Selector (only if colors exist) */}
          {hasColors && (
            <div className="space-y-2">
              <span>
                {product.collections?.some((collection) =>
                  collection.slug.includes("strap")
                )
                  ? "Fastener"
                  : "Strap"}
                : {selectedColorSafe}
              </span>{" "}
              <ColorSelector
                mode="single"
                colors={allColors}
                selectedColors={[selectedColorSafe]}
                onColorSelect={handleColorChange}
              />
            </div>
          )}
          <div className="space-y-1">
            <span>Quantity:</span>
            <QuantitySelector
              quantity={quantity}
              setQuantity={setQuantity}
              mode="product"
            />
          </div>
          <ProductActions
            product={product}
            quantity={quantity}
            selectedSize={selectedSize ?? ""}
            color={selectedColor ?? ""}
          />
        </div>
      </div>
    </section>
  );
}
