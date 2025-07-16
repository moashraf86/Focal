"use client";
import React from "react";
import GuestCheckoutForm from "@/components/checkout/guest/GuestCheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import { loadFromLocalStorage } from "@/lib/localStorage";
import { notFound } from "next/navigation";

export default function GuestCheckout() {
  const cartItems = loadFromLocalStorage();
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (hasMounted && cartItems.length === 0) {
    notFound();
  }

  return (
    <main className="lg:h-[calc(100vh-4rem)]">
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:h-full">
        <div className="order-1 lg:order-0 col-span-1 space-y-6 xl:ps-16">
          <GuestCheckoutForm />
        </div>
        <div className="order-0 lg:order-1 col-span-1 xl:pe-16 bg-muted">
          <OrderSummary />
        </div>
      </div>
    </main>
  );
}
