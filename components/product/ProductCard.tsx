"use client";
import { Product } from "../../lib/definitions";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { useQuickView } from "@/hooks/useQuickView";
import { useCart } from "@/hooks/useCart";
import { Loader2 } from "lucide-react";

export default function ProductCard({
  product,
  selectedColor,
  selectedSize,
}: {
  product: Product;
  selectedColor?: string | string[] | undefined;
  selectedSize?: string | string[] | undefined;
}) {
  const { addProductToCart, isAdding } = useCart();
  const { openQuickView } = useQuickView();

  // check if the params are arrays or undefined
  const size = Array.isArray(selectedSize) ? selectedSize[0] : selectedSize;

  const color = !selectedColor
    ? product.sizes?.[0]?.colors?.[0]?.name
    : Array.isArray(selectedColor)
    ? selectedColor[0]
    : selectedColor;

  // Get chosen size and color
  let chosenSize = product.sizes?.find((s) => s.value === size);
  // if no size selected but color selected, find the size that has the color
  if (!chosenSize && color) {
    chosenSize = product.sizes?.find((sizeObj) =>
      sizeObj.colors?.some((colorObj) => colorObj.name === color)
    );
  }
  // if no size or color selected, fallback to the first size and color
  if (!chosenSize) {
    chosenSize = product.sizes?.[0];
  }

  // Get the chosen color from the chosen size
  const chosenColor = chosenSize?.colors?.find((c) => c.name === color);

  // Get the first image of the chosen color or fallback to the first image of the product
  const image = chosenColor?.images?.[0] || product.images?.[0];
  const imageUrl = image?.url;
  const imageAlt = image?.alternativeText;

  const hoverImage = product.images?.[1];
  const hoverImageUrl = hoverImage?.url;

  //check if the product has any featured labels
  const isLimitedEdition = product.categories?.some(
    (category) => category.slug === "limited-edition"
  );

  const isNew = product.collections?.some(
    (category) => category.slug === "new-arrival"
  );

  // Check if product has options (sizes with colors)
  const hasOptions =
    product.sizes?.some((size) => size.colors && size.colors.length > 1) ||
    product.sizes?.length > 1;

  // Handle add to cart action
  const handleAddToCart = (product: Product) => {
    if (!chosenSize || !chosenColor) {
      console.error("Product must have a size and color selected.");
      return;
    }
    addProductToCart(product, 1, chosenSize.value, chosenColor.name);
  };

  // Handle quick view action
  const handleQuickView = (product: Product) => {
    openQuickView(product);
  };

  return (
    <div className="space-y-4">
      <div className="relative group grid gap-4 overflow-hidden">
        <Link
          href={`/products/${product.slug}?size=${chosenSize?.value}&color=${chosenColor?.name}`}
          className="group aspect-[3/4] relative overflow-hidden bg-gray-100 block"
        >
          <Image
            className="group-hover:opacity-0 object-cover transition-opacity duration-300"
            src={imageUrl}
            alt={imageAlt || "product image"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <Image
            className="opacity-0 group-hover:opacity-100 object-cover transition-opacity duration-300"
            src={hoverImageUrl}
            alt={hoverImageUrl || "product image Hover"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {/* Product Labels */}
          <div className="absolute top-2 left-2 flex flex-col items-center justify-center gap-1 z-10">
            {isLimitedEdition && (
              <span className="inline-block py-0.5 px-1.5 bg-[#1f8f8f] text-primary-foreground text-xs uppercase font-barlow font-semibold tracking-wider">
                Limited Edition
              </span>
            )}
            {isNew && (
              <span className="inline-block py-0.5 px-1.5 bg-[#051e38] text-primary-foreground text-xs uppercase font-barlow font-semibold tracking-wider">
                New
              </span>
            )}
          </div>
        </Link>
        {hasOptions ? (
          <Button
            size="lg"
            className="absolute bottom-2 left-2 right-2 z-20 font-normal font-barlow tracking-wider hidden group-hover:flex justify-center items-center px-4 py-2"
            onClick={() => handleQuickView(product)}
          >
            Quick View
          </Button>
        ) : (
          <Button
            size="lg"
            className="absolute bottom-2 left-2 right-2 z-20 font-normal font-barlow tracking-wider hidden group-hover:flex justify-center items-center px-4 py-2"
            onClick={() => handleAddToCart(product)}
          >
            {isAdding ? (
              <span>
                <Loader2 className="animate-spin" />
              </span>
            ) : (
              "Add to Cart"
            )}
          </Button>
        )}
      </div>
      {/* Product name & price */}
      <div className="px-2 space-y-2">
        <h2 className="text-center font-barlow">{product.name}</h2>
        <p className="text-sm text-center">${product.price.toFixed(2)} USD</p>
      </div>
    </div>
  );
}
