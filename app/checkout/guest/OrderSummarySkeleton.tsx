import { Skeleton } from "@/components/ui/skeleton";
import { CartItem } from "@/lib/definitions";
import React from "react";

export default function OrderSummarySkeleton({
  cartItems,
}: {
  cartItems: CartItem[];
}) {
  return (
    <section className="border-l border-border min-h-[calc(100vh-10rem)] p-10 space-y-6">
      <h2 className="text-lg md:text-xl font-semibold font-barlow tracking-wide">
        Order Summary
      </h2>
      <div className="space-y-4 divide-y divide-border">
        {cartItems.length > 0 &&
          cartItems.map((item) => (
            <div
              key={item.documentId}
              className="flex justify-between items-center pt-4 first:pt-0"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="w-16 h-16 rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="w-40 h-3 mb-1" />
                  <Skeleton className="w-20 h-2" />
                </div>
              </div>
              <Skeleton className="w-16 h-3" />
            </div>
          ))}
      </div>
      <div className="border-t border-border pt-4">
        <div className="flex justify-between">
          <Skeleton className="w-24 h-3" />
          <Skeleton className="w-16 h-3" />
        </div>
        <div className="flex justify-between mt-3">
          <Skeleton className="w-16 h-3" />
          <Skeleton className="w-10 h-3" />
        </div>
        <div className="flex justify-between mt-6">
          <Skeleton className="w-16 h-4" />
          <Skeleton className="w-16 h-4" />
        </div>
      </div>
    </section>
  );
}
