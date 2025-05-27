"use client";

import { CartItem as CartItemType } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import CartItem from "@/components/cart/CartItem";
import CartTable from "@/components/cart/CartTable";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import ItemsCount from "./ItemsCount";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";

export default function Cart({
  cartItems,
  isLoading,
  onRemoveItem,
}: {
  cartItems: CartItemType[];
  isLoading: boolean;
  onRemoveItem?: (id: string) => void;
}) {
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const { removeCartItem, clearCart } = useCart();

  // Remove cart item
  const handleRemoveCartItem = (id: string) => {
    setItemToRemove(id);
    setTimeout(() => {
      onRemoveItem?.(id);
    }, 300); // Match the animation duration

    setTimeout(() => {
      removeCartItem(id);
      setItemToRemove(null);
    }, 350);
  };

  // reverse the order to show the last added items first
  const sortedCartItems = [...cartItems].reverse();

  return (
    <>
      <div className="space-y-6 col-span-3 lg:col-span-2">
        <CartTable>
          {sortedCartItems.map((item, index) => (
            <CartItem
              key={item.documentId}
              item={item}
              removeCartItem={() => handleRemoveCartItem(item.documentId)}
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
    </>
  );
}
