"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/lib/definitions";
import { Loader2 } from "lucide-react";
import { ToastAction } from "../ui/toast";
import Link from "next/link";
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
  const handleAddToCart = async () => {
    addProductToCart(product, quantity, selectedSize, color);
    // Simulate 250ms network delay before showing toast
    await new Promise((resolve) => setTimeout(resolve, 250));
    toast({
      title: "Product added to cart",
      variant: "success",
      duration: 1500,
      action: (
        <ToastAction altText="view-cart">
          <Link href="/cart" className="text-inherit">
            View Cart
          </Link>
        </ToastAction>
      ),
    });
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
