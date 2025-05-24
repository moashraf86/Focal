import { fetchOrderById } from "@/lib/data";
import { OrderItem } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

  const { data: order } = await fetchOrderById(orderId);

  console.log("order", order);

  // get total price
  const totalPrice = order.order_items.reduce(
    (acc: number, item: OrderItem) => {
      return acc + item.product.price * item.quantity;
    },
    0
  );

  return (
    <div className="container max-w-xl">
      <div className="flex flex-col items-start justify-center gap-6 min-h-[calc(100vh-100px)] mx-auto py-10">
        <div className="space-y-3">
          <span className="text-xs text-sky-600 font-barlow font-bold uppercase tracking-widest">
            Payment Successful
          </span>
          <h1 className="text-4xl font-light uppercase tracking-tight">
            Thanks for ordering
          </h1>
          <p className="mt-4 text-lg">
            Your order{" "}
            <span className="font-normal text-sky-600">
              #{order.order_number}
            </span>{" "}
            has been confirmed. We’re processing it and will ship it to you
            shortly.
          </p>
        </div>
        <ul className="flex flex-col items-start justify-center w-full">
          {order.order_items.map((item: OrderItem, index: number) => (
            <li
              key={item.id}
              className={cn(
                "flex items-start justify-start w-full py-4 border-b border-border gap-3",
                {
                  "border-t": index === 0,
                }
              )}
            >
              <Image
                src={item.product.images[0].formats.small.url}
                alt={item.product.images[0].name}
                width={100}
                height={100}
                className="aspect-square object-cover rounded"
                loading="lazy"
              />
              <div className="space-y-2 font-light">
                <Link
                  href={`/products/${item.product.slug}`}
                  className="text-base font-barlow leading-tight hover:underline underline-offset-2 font-normal"
                >
                  {item.product.name}
                </Link>
                <p>
                  {item.size} / {item.color}
                </p>
                <p>Qty: {item.quantity}</p>
              </div>
              <span className="inline-flex ml-auto">
                ${item.product.price * item.quantity}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between w-full">
          <span className="text-lg font-medium">Total</span>
          <span className="text-lg font-medium">${totalPrice}</span>
        </div>
        {/* Shipping */}
        <div className="flex items-start justify-between w-full border-t border-border py-6">
          <span className="font-medium">Shipping Address</span>
          <div className="space-y-1 text-end">
            <p>{order.shipping_address.line1}</p>
            <p>{order.shipping_address.line2}</p>
            <p>
              {order.shipping_address.city}, {order.shipping_address.state},{" "}
              {order.shipping_address.postal_code},{" "}
              {order.shipping_address.country}
            </p>
          </div>
        </div>
        {/* Payment method */}
        <div className="flex items-start justify-between w-full">
          <span className="font-medium">Payment information</span>
          <div className="space-y-1 text-end">
            <p>{order.payment_method?.card?.brand}</p>
            <p>Ending with {order.payment_method?.card?.last4}</p>
            <p>
              Expires {order.payment_method?.card?.exp_month}/
              {order.payment_method?.card?.exp_year.toString().slice(-2)}
            </p>
          </div>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 text-sky-600 hover:text-sky-500 self-end font-medium"
        >
          Continue Shopping
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
