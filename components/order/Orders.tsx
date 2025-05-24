"use client";

import OrderItem from "@/components/order/OrderItem";
import OrderSummary from "@/components/order/OrderSummary";
import OrderTable from "@/components/order/OrderTable";
import { Order } from "@/lib/definitions";
import { use } from "react";

export default function Orders({ orders }: { orders: Promise<Order[]> }) {
  const allOrders = use(orders);
  return (
    <>
      {allOrders?.map((order: Order) => (
        <div key={order.id} className="mb-20">
          <OrderSummary order={order} />
          <OrderTable>
            {order.order_items.map((item) => (
              <OrderItem key={item.id} item={item} />
            ))}
          </OrderTable>
        </div>
      ))}
    </>
  );
}
