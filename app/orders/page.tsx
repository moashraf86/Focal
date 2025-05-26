import { fetchOrders } from "@/lib/data";
import { currentUser } from "@clerk/nextjs/server";
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
    <main className="container max-w-screen-xl mx-auto pt-10 pb-20">
      <Orders orders={orders} />
    </main>
  );
}
