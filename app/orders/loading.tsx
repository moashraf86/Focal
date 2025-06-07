"use client";
import OrderSkeleton from "@/components/order/OrderSkeleton";
import React from "react";

export default function Loading() {
  return (
    <main className="container max-w-screen-lg mx-auto pt-10 pb-20">
      <section className="space-y-10">
        <div className="space-y-2">
          <h1 className="text-4xl font-light uppercase text-center tracking-tight">
            Orders
          </h1>
          <p className="text-center">
            Check the status of your order, manage returns, and discover similar
            products.
          </p>
        </div>
        <OrderSkeleton mode="history" />
      </section>
    </main>
  );
}
