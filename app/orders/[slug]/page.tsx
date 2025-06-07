import { Suspense } from "react";
import OrderDetails from "@/components/order/OrderDetails";
import { fetchOrderById } from "@/lib/data";
import { Order as OrderType } from "@/lib/definitions";
import { currentUser } from "@clerk/nextjs/server";
import Loading from "./loading"; // Assuming this is your loading.tsx skeleton

export const metadata = {
  title: "Order Details",
  description: "View details of your order.",
};

export default async function Order({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: orderId } = await params;
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;
  const isGuest = !email;
  let order: OrderType | undefined;

  if (!isGuest) {
    try {
      order = await fetchOrderById(orderId);
    } catch (error) {
      console.error("Failed to fetch order:", error);
    }
  }

  return (
    <main className="container max-w-screen-lg mx-auto pt-10 pb-20">
      <Suspense fallback={<Loading />}>
        <section className="space-y-10">
          <OrderDetails order={order} orderId={orderId} isGuest={isGuest} />
        </section>
      </Suspense>
    </main>
  );
}
