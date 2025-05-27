import { Product } from "@/lib/definitions";
import ProductCard from "./ProductCard";
import { expandProducts } from "@/lib/utils";

export default function ProductList({
  products,
  selectedSize,
  selectedColor,
}: {
  products: Product[];
  selectedSize?: string | string[] | undefined;
  selectedColor?: string | string[] | undefined;
}) {
  /**
   * Get expanded products based on selected size and color
   * This function duplicates products when multiple colors and sizes are selected
   */
  const expandedProducts = expandProducts(
    products,
    selectedSize,
    selectedColor
  );

  return (
    <>
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
    </>
  );
}
