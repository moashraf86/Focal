"use client";
import React from "react";
import GuestCheckoutForm from "./GuestCheckoutForm";
import OrderSummary from "./OrderSummary";
import { loadFromLocalStorage } from "@/lib/localStorage";
import { notFound } from "next/navigation";

export default function GuestCheckout() {
  const cartItems = loadFromLocalStorage();

  if (cartItems.length === 0) {
    notFound();
  }

  return (
    <main className="h-[calc(100vh-4rem)]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        <div className="col-span-1 space-y-6 ps-24">
          <GuestCheckoutForm />
        </div>
        <div className="col-span-1 pe-24 bg-muted">
          <OrderSummary />
        </div>
      </div>
    </main>
  );
}
