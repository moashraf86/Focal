import { fetchOrders } from "@/lib/data";
import { currentUser } from "@clerk/nextjs/server";
import Orders from "../../components/order/Orders";
import { Order } from "@/lib/definitions";
import { Suspense } from "react";
import Loading from "./loading";

export const metadata = {
  title: "Orders",
  description: "View and manage your orders.",
};

export default async function OrdersPage() {
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;
  const isGuest = !email;
  let orders: Order[] = [];
  // If the user is a guest, we will not fetch orders from the server
  // Instead, we will fetch orders from local storage in the <Orders /> component
  if (!isGuest) {
    try {
      orders = await fetchOrders(email);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      return (
        <main className="container max-w-screen-lg mx-auto pt-10 pb-20">
          <p className="text-red-600">
            Failed to load orders. Please try again later.
          </p>
        </main>
      );
    }
  }
  return (
    <main className="container max-w-screen-lg mx-auto pt-10 pb-20">
      <Suspense fallback={<Loading />}>
        <Orders orders={orders} isGuest={isGuest} />
      </Suspense>
    </main>
  );
}
