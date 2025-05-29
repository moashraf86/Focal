import OrderSkeleton from "@/components/order/OrderSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="container max-w-screen-lg mx-auto py-10">
      <section className="space-y-10">
        <div className="space-y-2">
          <h1 className="text-4xl font-light uppercase text-center tracking-tight">
            Order #<Skeleton className="inline-block w-[100px] h-6" />
          </h1>
          <p className="text-center">
            Check the status of your order, manage returns, and discover
          </p>
        </div>
        <OrderSkeleton mode="details" />
      </section>
    </main>
  );
}
