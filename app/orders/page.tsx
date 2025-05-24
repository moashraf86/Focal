import { fetchOrders } from "@/lib/data";
import OrderSkeleton from "@/components/order/OrderSkeleton";
import { currentUser } from "@clerk/nextjs/server";
import { Suspense } from "react";
import Orders from "../../components/order/Orders";

export const metadata = {
  title: "Orders",
  description: "View and manage your orders.",
};

export default async function OrdersPage() {
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;
  const orders = fetchOrders(email);

  return (
    <section>
      <div className="container max-w-screen-lg mx-auto">
        <div className="space-y-2 py-10">
          <h1 className="text-4xl font-light uppercase text-center tracking-tight">
            Orders
          </h1>
          <p className="text-center">
            Check the status of recent orders, manage returns, and discover
            similar products.
          </p>
        </div>
        <Suspense fallback={<OrderSkeleton mode="history" />}>
          <Orders orders={orders} />
        </Suspense>
      </div>
    </section>
  );
}
