"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/lib/definitions";
import { Loader2 } from "lucide-react";
import { ToastAction } from "../ui/toast";
import Link from "next/link";
import { cn } from "@/lib/utils";
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
    await new Promise((resolve) => setTimeout(resolve, 1200));
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
    <div className="flex flex-col gap-4 shrink-0">
      <Button
        onClick={handleAddToCart}
        variant="success"
        size="lg"
        disabled={isAdding}
        className="w-full relative"
      >
        <span
          className={cn(
            isAdding ? "opacity-0 -translate-y-4" : "opacity-100",
            "transition-all duration-200"
          )}
        >
          Add to Cart
        </span>
        <span
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-200",
            isAdding ? "opacity-100" : "opacity-0 -translate-y-4"
          )}
        >
          <Loader2 className="animate-spin" />
        </span>
      </Button>
    </div>
  );
}
