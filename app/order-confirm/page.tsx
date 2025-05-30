import OrderConfirmClient from "../../components/order-confirm/OrderConfirmClient";

export const metadata = {
  title: "Payment Confirmation",
  description: "Your payment has been successfully processed.",
};

export default async function OrderConfirm({
  searchParams,
}: {
  searchParams: { orderId: string };
}) {
  const params = await searchParams;

  const { orderId } = params;

  return <OrderConfirmClient orderId={orderId} />;
}
