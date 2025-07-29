"use client";

import { cn } from "@/lib/utils";
import CartItem from "@/components/cart/CartItem";
import CartTable from "@/components/cart/CartTable";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/hooks/useCart";
import ItemsCount from "./ItemsCount";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import CheckoutBox from "./CheckoutBox";
import CartSkeleton from "./CartSkeleton";
import Link from "next/link";
import RelatedProducts from "../product/RelatedProducts";

export default function Cart() {
  //  fetch cart items
  const { cartItems, isLoading, getTotalPrice } = useCart();
  // local state to manage visible items
  const [visibleItems, setVisibleItems] = useState(cartItems);

  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const { removeCartItem, clearCart } = useCart();

  // Remove cart item
  const handleRemoveCartItem = (id: string) => {
    setItemToRemove(id);
    setTimeout(() => {
      setVisibleItems((prev) => prev.filter((item) => item.documentId !== id));
    }, 300); // Match the animation duration

    setTimeout(() => {
      removeCartItem(id);
      setItemToRemove(null);
    }, 350);
  };

  // Update visible items when cart items change
  // Update visibleItems only when cartItems or isLoading changes
  useEffect(() => {
    if (!isLoading) {
      setVisibleItems(cartItems || []);
    }
  }, [cartItems, isLoading]);

  // Reverse the order to show the last added items first
  const sortedCartItems = useMemo(
    () => [...visibleItems].reverse(),
    [visibleItems]
  );

  const isCartEmpty = visibleItems.length === 0 && !isLoading;

  // if cart is empty
  if (isCartEmpty) {
    return (
      <section className="h-[50vh] flex items-center justify-center">
        <div className="space-y-6 max-w-md mx-auto text-center">
          <h1 className="relative inline-block text-4xl font-light uppercase text-center tracking-tight">
            Cart
            <span className="absolute top-0 -right-8 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs">
              0
            </span>
          </h1>
          <p className="text-lg font-light">Your cart is empty.</p>
          <Button asChild variant="emphasis" size="lg">
            <Link href="/">Start Shopping</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="container max-w-screen-xl mx-auto space-y-10 mb-10">
        <h1 className="text-4xl font-light uppercase text-center tracking-tight">
          Cart
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {isLoading && <CartSkeleton />}
          {/* Cart items */}
          {!isLoading && cartItems.length > 0 && (
            <>
              <div className="space-y-6 col-span-3 lg:col-span-2">
                <CartTable>
                  {sortedCartItems.map((item, index) => (
                    <CartItem
                      key={item.documentId}
                      item={item}
                      removeCartItem={() =>
                        handleRemoveCartItem(item.documentId)
                      }
                      style={{
                        animationDuration: `${300 + index * 100}ms`,
                      }}
                      className={cn(
                        "transition-transform ease-in-out will-change-transform",
                        itemToRemove === item.documentId
                          ? "animate-out slide-out-to-left fade-out duration-300"
                          : "animate-in slide-in-from-top-4 fade-in duration-300"
                      )}
                    />
                  ))}
                </CartTable>
                {!isLoading && cartItems.length > 0 && (
                  <div className="flex items-center justify-between">
                    <ItemsCount items={cartItems} />
                    <Button
                      variant="ghost"
                      className="text-gray-500 hover:text-destructive hover:bg-destructive/10 focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2"
                      onClick={clearCart}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Clear Cart
                    </Button>
                  </div>
                )}
              </div>
              <CheckoutBox total={getTotalPrice()} />
            </>
          )}
        </div>
      </section>
      <RelatedProducts categories={["men"]} face="1969" />
    </>
  );
}
