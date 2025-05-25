"use client";
import Cart from "@/components/cart/Cart";
import CartSkeleton from "@/components/cart/CartSkeleton";
import CheckoutBox from "@/components/cart/CheckoutBox";
import RelatedProducts from "@/components/product/RelatedProducts";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
  //  fetch cart items
  const { cartItems, isLoading, getTotalPrice } = useCart();
  // local state to manage visible items
  const [visibleItems, setVisibleItems] = useState(cartItems);

  // handle item removal
  const handleItemRemoved = (itemId: string) => {
    setVisibleItems((prev) =>
      prev.filter((item) => item.documentId !== itemId)
    );
  };

  useEffect(() => {
    if (cartItems.length > 0) {
      setVisibleItems(cartItems);
    }
  }, [cartItems]);

  const isCartEmpty = visibleItems.length === 0 && !isLoading;

  // if cart is empty
  if (isCartEmpty) {
    return (
      <section className="container max-w-screen-xl h-[calc(100vh-10rem)] flex items-center justify-center">
        <div className="space-y-6 max-w-md mx-auto text-center">
          <div className="inline-block relative">
            <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs">
              0
            </span>
            <ShoppingBag className="size-12" />
          </div>
          <p className="text-2xl font-light">Your cart is empty</p>
          <Button asChild variant="emphasis" className="w-full" size="lg">
            <Link href="/">Start Shopping</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <main>
      <section className="container max-w-screen-xl mb-10">
        <h1 className="text-4xl font-light uppercase text-center tracking-tight py-10">
          Cart
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {isLoading && <CartSkeleton />}
          {/* Cart items */}
          {!isLoading && cartItems.length > 0 && (
            <>
              <Cart
                cartItems={visibleItems}
                isLoading={isLoading}
                onRemoveItem={handleItemRemoved}
              />
              <CheckoutBox total={getTotalPrice()} />
            </>
          )}
        </div>
      </section>
      <RelatedProducts category="men" face="1969" />
    </main>
  );
}
