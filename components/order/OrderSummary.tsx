import Link from "next/link";
import { Button } from "../ui/button";
import { Order } from "@/lib/definitions";
import ProductPrice from "../product/ProductPrice";

export default function OrderSummary({ order }: { order: Order }) {
  return (
    <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row items-center justify-between bg-muted rounded p-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 grow w-full">
        <div className="flex justify-between sm:flex-col gap-1 col-span-1 border-b sm:border-b-0 border-border pb-4 sm:pb-0">
          <span className="text-sm font-medium">Order number</span>
          <span className="text-sm text-gray-500">{order.order_number}</span>
        </div>
        <div className="flex justify-between sm:flex-col gap-1 col-span-1 border-b sm:border-b-0 border-border pb-4 sm:pb-0">
          <span className="text-sm font-medium">Date placed</span>
          <span className="text-sm text-gray-500">
            {order.createdAt.split("T")[0]}
          </span>
        </div>
        <div className="flex justify-between sm:flex-col gap-1 col-span-1 border-b sm:border-b-0 border-border pb-4 sm:pb-0">
          <span className="text-sm font-medium">Total amount</span>
          <ProductPrice className="text-sm font-medium" price={order.amount} />
        </div>
      </div>
      <Button asChild variant="outline" className="w-full sm:w-auto">
        <Link href={`/orders/${order.documentId}`}>View Order</Link>
      </Button>
    </div>
  );
}
