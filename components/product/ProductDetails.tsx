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

// Helper functions to handle the Strapi structure intelligently
function analyzeProductStructure(product: Product) {
  const sizes = Array.isArray(product.sizes) ? product.sizes : [];

  // Check if we have actual sizes (non-null, non-empty values)
  const actualSizes = sizes.filter(
    (size) =>
      size.value !== null && size.value !== "" && size.value !== undefined
  );
  const hasActualSizes = actualSizes.length > 0;

  // Get colors based on structure
  let availableColors: Color[] = [];

  if (hasActualSizes) {
    // Product has real sizes, colors come from size selection
    availableColors = actualSizes[0]?.colors || [];
  } else if (
    sizes.length > 0 &&
    Array.isArray(sizes[0]?.colors) &&
    sizes[0].colors.length > 0
  ) {
    // Product has no sizes but colors are stored in the first size entry (your current case)
    availableColors = sizes[0].colors;
  }

  return {
    hasActualSizes,
    actualSizes,
    availableColors,
    hasColors: availableColors.length > 0,
    // Debug info (remove in production)
    debug: {
      sizesLength: sizes.length,
      firstSizeValue: sizes[0]?.value,
      firstSizeColorsLength: sizes[0]?.colors?.length || 0,
    },
  };
}

function getColorsForSize(product: Product, sizeValue?: string) {
  const { hasActualSizes, actualSizes, availableColors } =
    analyzeProductStructure(product);

  if (!hasActualSizes) {
    // No actual sizes, return the available colors
    return availableColors;
  }

  if (!sizeValue) {
    return [];
  }

  const sizeObj = actualSizes.find((size) => size.value === sizeValue);
  return Array.isArray(sizeObj?.colors) ? sizeObj.colors : [];
}

function getProductImages(
  product: Product,
  selectedSize?: string,
  selectedColor?: string
) {
  const { hasActualSizes, availableColors } = analyzeProductStructure(product);

  let colorsToSearch: Color[] = [];

  if (hasActualSizes && selectedSize) {
    colorsToSearch = getColorsForSize(product, selectedSize);
  } else {
    colorsToSearch = availableColors;
  }

  if (selectedColor && colorsToSearch.length > 0) {
    const colorObj = colorsToSearch.find(
      (color) => color.name === selectedColor
    );
    if (colorObj?.images && colorObj.images.length > 0) {
      return colorObj.images;
    }
  }

  // Fallback to product images
  return product.images ?? [];
}

export default function ProductDetails({
  product,
  initialQuantity = 1,
}: {
  product: Product;
  initialQuantity?: number;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State variables
  const [resetCarousel, setResetCarousel] = useState(false);
  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const intersectionRef = useProductVisibilityObserver();

  // Analyze product structure
  const { hasActualSizes, actualSizes, hasColors } =
    analyzeProductStructure(product);

  // Get defaults
  const defaultSize = hasActualSizes ? actualSizes[0].value : undefined;
  const selectedSize = searchParams.get("size") || defaultSize;

  // Get colors based on current selection
  const availableColors = getColorsForSize(product, selectedSize);
  const defaultColor =
    availableColors.length > 0 ? availableColors[0].name : undefined;
  const selectedColor = searchParams.get("color") || defaultColor;

  // Get carousel images
  const carouselImages = getProductImages(product, selectedSize, selectedColor);

  // Scroll to top
  useScrollToTop();

  // Handle size change
  const handleSizeChange = (newSize: string) => {
    const newAvailableColors = getColorsForSize(product, newSize);
    const newDefaultColor =
      newAvailableColors.length > 0 ? newAvailableColors[0].name : undefined;

    // Build new URL params
    const params = new URLSearchParams();
    params.set("size", newSize);
    if (newDefaultColor) {
      params.set("color", newDefaultColor);
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Handle color change
  const handleColorChange = (newColor: string) => {
    const params = new URLSearchParams();
    if (hasActualSizes && selectedSize) {
      params.set("size", selectedSize);
    }
    params.set("color", newColor);

    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Update carousel when selection changes
  useEffect(() => {
    setResetCarousel((prev) => !prev);
  }, [selectedSize, selectedColor]);

  // Set initial URL params if needed
  useEffect(() => {
    const currentParams = new URLSearchParams(searchParams.toString());
    const needsSizeParam = hasActualSizes && !currentParams.has("size");
    const needsColorParam = hasColors && !currentParams.has("color");

    if (needsSizeParam || needsColorParam) {
      const params = new URLSearchParams(currentParams);

      if (needsSizeParam && selectedSize) {
        params.set("size", selectedSize);
      }
      if (needsColorParam && selectedColor) {
        params.set("color", selectedColor);
      }

      const newUrl = `?${params.toString()}`;
      // Only update if URL actually changes
      if (newUrl !== `?${currentParams.toString()}`) {
        router.replace(newUrl, { scroll: false });
      }
    }
  }, []); // Only run on mount

  // Safe values for rendering
  const selectedSizeSafe = selectedSize || "";
  const selectedColorSafe = selectedColor || "";

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
            <div className="flex items-center gap-1 text-lg lg:text-2xl font-normal font-barlow">
              <ProductPrice
                price={product.price}
                className="text-lg lg:text-2xl font-barlow font-normal"
              />
              USD
            </div>
            <ProductRating rating={5} reviews={3} />
          </div>

          {/* Size Selector - Only show if product has actual sizes */}
          {hasActualSizes && (
            <div className="space-y-2">
              <span>
                {product.collections?.some((collection) =>
                  collection.slug.includes("strap")
                )
                  ? "Strap width"
                  : "Watch size"}
                : {selectedSizeSafe}
              </span>
              <ProductSizeSelector
                sizes={actualSizes}
                selectedSize={selectedSizeSafe}
                onSizeChange={handleSizeChange}
              />
            </div>
          )}

          {/* Color Selector - Show if any colors are available */}
          {hasColors && availableColors.length > 0 && (
            <div className="space-y-2">
              <span>
                {product.collections?.some((collection) =>
                  collection.slug.includes("strap")
                )
                  ? "Fastener"
                  : "Strap"}
                : {selectedColorSafe}
              </span>
              <ColorSelector
                mode="single"
                colors={availableColors}
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
            selectedSize={selectedSizeSafe}
            color={selectedColorSafe}
          />
        </div>
      </div>
    </section>
  );
}
