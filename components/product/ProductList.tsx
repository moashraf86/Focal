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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
        />
      ))}
    </div>
  );
}
