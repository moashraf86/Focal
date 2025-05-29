"use client";

import OrderItem from "@/components/order/OrderItem";
import OrderSummary from "@/components/order/OrderSummary";
import OrderTable from "@/components/order/OrderTable";
import { Order } from "@/lib/definitions";
import { use } from "react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function Orders({ orders }: { orders: Promise<Order[]> }) {
  const allOrders = use(orders);

  if (!allOrders || allOrders.length === 0) {
    return (
      <section className="h-[50vh] flex items-center justify-center">
        <div className="space-y-6 max-w-md mx-auto text-center">
          <h1 className="relative inline-block text-4xl font-light uppercase text-center tracking-tight">
            Orders
            <span className="absolute top-0 -right-8 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs">
              0
            </span>
          </h1>
          <p className="text-lg font-light">
            You have not placed any orders yet.
          </p>
          <Button asChild variant="emphasis" size="lg">
            <Link href="/">Start Shopping</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-4xl font-light uppercase text-center tracking-tight">
          Orders
        </h1>
        <p className="text-center">
          Check the status of recent orders, manage returns, and discover
          similar products.
        </p>
      </div>
      {allOrders?.map((order: Order) => (
        <div key={order.id} className="border-b border-border last:border-0">
          <OrderSummary order={order} />
          <OrderTable>
            {order.order_items.map((item) => (
              <OrderItem key={item.id} item={item} />
            ))}
          </OrderTable>
        </div>
      ))}
    </section>
  );
}
