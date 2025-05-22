"use client";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/lib/definitions";
import { Loader2 } from "lucide-react";
export default function ProductActions({
  product,
  quantity,
  selectedSize,
  color,
}: {
  product: Product;
  quantity: number;
  selectedSize: string;
  color?: string;
}) {
  const { addProductToCart, isAdding } = useCart();

  // Add product to cart
  const handleAddToCart = () => {
    addProductToCart(product, quantity, selectedSize, color);
  };

  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={handleAddToCart}
        variant="success"
        size="lg"
        disabled={isAdding}
      >
        {isAdding ? (
          <span>
            <Loader2 className="animate-spin" />
          </span>
        ) : (
          "Add to Cart"
        )}
      </Button>
    </div>
  );
}
