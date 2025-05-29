import PaymentConfirmClient from "./PaymentConfirmClient";

export const metadata = {
  title: "Payment Confirmation",
  description: "Your payment has been successfully processed.",
};

export default async function PaymentConfirm({
  searchParams,
}: {
  searchParams: { orderId: string };
}) {
  const params = await searchParams;

  const { orderId } = params;

  return <PaymentConfirmClient orderId={orderId} />;
}
