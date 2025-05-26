import { Product } from "@/lib/definitions";
import ProductCard from "./ProductCard";

export default function ProductList({
  products,
  selectedSize,
  selectedColor,
}: {
  products: Product[];
  selectedSize?: string | string[] | undefined;
  selectedColor?: string | string[] | undefined;
}) {
  // Duplicate products when multiple colors and sizes are selected
  const selectedColors = Array.isArray(selectedColor)
    ? selectedColor
    : selectedColor
    ? [selectedColor]
    : [];

  const size = Array.isArray(selectedSize) ? selectedSize[0] : selectedSize;

  const expandedProducts: {
    product: Product;
    color?: string;
  }[] = [];

  for (const product of products) {
    const matchedColors: Set<string> = new Set();

    if (size) {
      const chosenSize = product.sizes?.find((s) => s.value === size);
      if (chosenSize && selectedColors.length > 0) {
        chosenSize.colors?.forEach((colorObj) => {
          if (selectedColors.includes(colorObj.name)) {
            matchedColors.add(colorObj.name);
          }
        });
      }

      const uniqueColors = Array.from(matchedColors);
      if (uniqueColors.length > 0) {
        for (const color of uniqueColors) {
          expandedProducts.push({ product, color });
        }
      } else {
        expandedProducts.push({ product }); // optional fallback
      }
    } else {
      // No specific size selected — find all matched colors from all sizes
      product.sizes?.forEach((s) => {
        s.colors?.forEach((colorObj) => {
          if (selectedColors.includes(colorObj.name)) {
            matchedColors.add(colorObj.name);
          }
        });
      });

      const uniqueColors = Array.from(matchedColors);
      if (uniqueColors.length > 0) {
        for (const color of uniqueColors) {
          expandedProducts.push({ product, color });
        }
      } else {
        // No matched color and no size selected — fallback to default view
        expandedProducts.push({ product });
      }
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {expandedProducts.map(({ product, color }) => (
        <ProductCard
          key={`${product.id}-${color || "default"}`}
          product={product}
          selectedSize={selectedSize}
          selectedColor={color}
        />
      ))}
    </div>
  );
}
