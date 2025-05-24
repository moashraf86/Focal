import { fetchOrderById } from "@/lib/data";
import OrderDetails from "@/components/order/OrderDetails";

export const metadata = {
  title: "Order Details",
  description: "View details of your order.",
};

export default async function Order({ params }: { params: { slug: string } }) {
  const { slug: orderId } = await params;

  // Fetch order details by ID
  const { data: order } = await fetchOrderById(orderId);

  return (
    <section className="container max-w-screen-lg mx-auto">
      <div className="space-y-2 py-10">
        <h1 className="text-4xl font-light uppercase text-center tracking-tight">
          Order #<span className="font-semibold">{order.order_number}</span>
        </h1>
        <p className="text-center">
          Check the status of your order, manage returns, and discover
        </p>
      </div>
      <OrderDetails order={order} />
    </section>
  );
}
