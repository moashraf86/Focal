import React from "react";
import OrderDetailsSummary from "./OrderDetailsSummary";
import OrderTable from "./OrderTable";
import OrderItem from "./OrderItem";
import { Order, OrderItem as orderItemType } from "@/lib/definitions";

export default function OrderDetails({ order }: { order: Order }) {
  return (
    <div key={order.id} className="mb-20">
      <OrderDetailsSummary order={order} />
      <OrderTable>
        {order.order_items.map((item: orderItemType) => (
          <OrderItem key={item.id} item={item} />
        ))}
      </OrderTable>
    </div>
  );
}
