import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import OrderConfirmClient from "../../components/order-confirm/OrderConfirmClient";

export const metadata = {
  title: "Payment Confirmation",
  description: "Your payment has been successfully processed.",
};

function OrderConfirmFallback() {
  return (
    <main className="container max-w-screen-lg mx-auto py-20">
      <Skeleton className="h-10 w-1/2 mx-auto mb-4" />
      <Skeleton className="h-6 w-2/3 mx-auto mb-10" />
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-12 w-1/3 ml-auto" />
      </div>
    </main>
  );
}

export default async function OrderConfirm({
  searchParams,
}: {
  searchParams: Promise<{ orderId: string }>;
}) {
  const params = await searchParams;

  const { orderId } = params;

  return (
    <Suspense fallback={<OrderConfirmFallback />}>
      <OrderConfirmClient orderId={orderId} />
    </Suspense>
  );
}
