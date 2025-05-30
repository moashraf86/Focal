"use client";

import OrderItem from "@/components/order/OrderItem";
import OrderSummary from "@/components/order/OrderSummary";
import OrderTable from "@/components/order/OrderTable";
import { Order } from "@/lib/definitions";
import { Button } from "../ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import OrderSkeleton from "./OrderSkeleton";

//Get orders from local storage for guest users
const getGuestOrdersFromLocalStorage = (): Order[] => {
  try {
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      return JSON.parse(storedOrders);
    }
  } catch (error) {
    console.error("Error reading guest orders from localStorage:", error);
  }
  return [];
};

export default function Orders({
  orders,
  isGuest,
}: {
  orders: Order[];
  isGuest: boolean;
}) {
  // all orders state to handle both guest and logged-in users
  const [allOrders, setAllOrders] = useState<Order[]>(orders || []);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    if (isGuest) {
      const guestOrders = getGuestOrdersFromLocalStorage();
      setAllOrders(guestOrders);
    }
  }, [isGuest, orders]);

  // reverse the order items to show the latest orders first
  const sortedOrders = allOrders?.slice().reverse() || [];

  // If the user has mounted and there are no orders, show a message
  if (hasMounted && !sortedOrders) {
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

  // If the user has not mounted yet, show a loading skeleton
  // This is useful for guest users or when the component is still loading
  if (!hasMounted) {
    return (
      <section className="space-y-10">
        <div className="space-y-2">
          <h1 className="text-4xl font-light uppercase text-center tracking-tight">
            Orders
          </h1>
          <p className="text-center">
            Check the status of your order, manage returns, and discover similar
            products.
          </p>
        </div>
        <OrderSkeleton mode="history" />
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
      {sortedOrders?.map((order: Order) => (
        <div
          key={order.documentId}
          className="border-b border-border last:border-0"
        >
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
