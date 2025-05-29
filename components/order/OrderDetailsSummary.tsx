import { Order } from "@/lib/definitions";
import ProductPrice from "../product/ProductPrice";

export default function OrderDetailsSummary({ order }: { order: Order }) {
  return (
    <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row items-center justify-between bg-muted rounded p-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 grow w-full">
        <div className="flex sm:flex-col justify-between sm:justify-start gap-1 col-span-1 border-b sm:border-b-0 border-border pb-4 sm:pb-0">
          <span className="text-sm font-medium">Shipping Address</span>
          <div className="text-sm space-y-1 text-end sm:text-start text-gray-500">
            <p>{order.shipping_address.line1}</p>
            <p>{order.shipping_address.line2}</p>
            <p>
              {order.shipping_address.city}, {order.shipping_address.state},{" "}
              {order.shipping_address.postal_code},{" "}
              {order.shipping_address.country}
            </p>
          </div>
        </div>
        <div className="flex sm:flex-col justify-between sm:justify-start gap-1 col-span-1 border-b sm:border-b-0 border-border pb-4 sm:pb-0">
          <span className="text-sm font-medium">Payment info</span>
          <div className="text-sm space-y-1 text-end sm:text-start text-gray-500">
            <p>Ending with {order.payment_method?.card?.last4}</p>
            <p>
              Expires {order.payment_method?.card?.exp_month}/
              {order.payment_method?.card?.exp_year.toString().slice(-2)}
            </p>
          </div>
        </div>
        <div className="flex sm:flex-col justify-between sm:justify-start gap-1 col-span-1 border-b sm:border-b-0 border-border pb-4 sm:pb-0">
          <span className="text-sm font-medium">Date placed</span>
          <span className="text-sm text-gray-500">
            {order.createdAt.split("T")[0]}
          </span>
        </div>
        <div className="flex justify-between gap-1 sm:col-span-3 sm:border-t border-border sm:pt-4">
          <span className="text-sm sm:text-lg font-medium">Total amount</span>
          <ProductPrice
            className="text-sm sm:text-lg font-medium"
            price={order.amount}
          />
        </div>
      </div>
    </div>
  );
}
