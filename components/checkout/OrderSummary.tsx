"use client";
import { CartItem } from "@/lib/definitions";
import Image from "next/image";
import OrderSummarySkeleton from "./OrderSummarySkeleton";
import ProductPrice from "@/components/product/ProductPrice";
import { useCart } from "@/hooks/useCart";
import { getProductImages } from "@/lib/helper";

export default function OrderSummary() {
  const { cartItems, isLoading, getTotalPrice } = useCart();

  if (isLoading) {
    return <OrderSummarySkeleton />;
  }

  return (
    <section className="lg:border-l border-border h-full px-6 py-8 lg:p-10 space-y-6 max-w-[40rem] mx-auto lg:mx-0">
      <h2 className="text-lg lg:text-xl font-semibold font-barlow tracking-wide">
        Order Summary
      </h2>
      {cartItems.length > 0 && (
        <div className="space-y-4 divide-y divide-border">
          {cartItems.map((item: CartItem) => {
            const selectedImage = getProductImages(
              item.product,
              item.size,
              item.color
            )[0];
            return (
              <div
                key={item.documentId}
                className="flex justify-between items-center pt-4 first:pt-0"
              >
                <div className="flex items-center gap-4">
                  <div className="border border-border rounded-md relative">
                    <Image
                      src={selectedImage.formats.small.url}
                      alt={item.product.name}
                      width={selectedImage.formats.small.width}
                      height={selectedImage.formats.small.height}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <span className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center bg-primary/50 text-xs text-white rounded-full p-2.5 font-semibold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold font-barlow tracking-wide">
                      {item.product.name}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {item.size} {item.color ? `/ ${item.color}` : ""}
                    </span>{" "}
                    <ProductPrice
                      className="text-xs text-muted-foreground font-sans"
                      price={item.product.price}
                    />
                  </div>
                </div>
                <span className="text-sm font-semibold">
                  <ProductPrice
                    className="text-sm font-semibold font-sans"
                    price={item.product.price * item.quantity}
                  />
                </span>
              </div>
            );
          })}
          <div className="border-t border-border pt-4">
            <div className="flex justify-between">
              <span className="text-sm font-semibold">
                Subtotal ·{" "}
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)} items
              </span>
              <ProductPrice
                className="text-sm font-semibold font-sans"
                price={getTotalPrice()}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-sm font-semibold">Shipping</span>
              <span className="text-sm font-semibold">Free</span>
            </div>
            <div className="flex justify-between mt-4">
              <span className="text-xl font-semibold">Total</span>
              <ProductPrice
                className="text-xl font-semibold"
                price={getTotalPrice()}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
