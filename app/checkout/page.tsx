import CheckoutClient from "./CheckoutClient";
import OrderSummary from "@/components/checkout/OrderSummary";
import CheckoutFormSkeleton from "@/components/checkout/CheckoutFormSkeleton";
import { Suspense } from "react";

export default function Checkout() {
  return (
    <main className="lg:min-h-[calc(100vh-4rem)]">
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:min-h-[calc(100vh-4rem)]">
        <div className="order-1 lg:order-0 col-span-1 space-y-6 xl:ps-16">
          <Suspense fallback={<CheckoutFormSkeleton />}>
            <CheckoutClient />
          </Suspense>
        </div>
        <div className="order-0 lg:order-1 col-span-1 xl:pe-16 bg-muted">
          <OrderSummary />
        </div>
      </div>
    </main>
  );
}
