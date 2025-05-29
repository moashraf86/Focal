import { CartItem } from "@/lib/definitions";
import React from "react";

export default function ItemsCount({ items }: { items: CartItem[] }) {
  return (
    <p className="text-sm text-gray-500">
      {(() => {
        const totalItems = items.reduce(
          (total, item) => total + item.quantity,
          0
        );
        return `You have ${totalItems} item${
          totalItems > 1 ? "s" : ""
        } in your cart.`;
      })()}
    </p>
  );
}
