"use client";
import React, { useEffect, useState } from "react";
import OrderDetailsSummary from "./OrderDetailsSummary";
import OrderTable from "./OrderTable";
import OrderItem from "./OrderItem";
import { Order, OrderItem as OrderItemType } from "@/lib/definitions";
import OrderSkeleton from "./OrderSkeleton";
import { Skeleton } from "../ui/skeleton";

interface OrderDetailsProps {
  orderId: string;
  order?: Order;
  isGuest: boolean;
}

function getGuestOrderFromLocalStorage(orderId: string): Order | undefined {
  try {
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      const orders: Order[] = JSON.parse(storedOrders);
      return orders.find((order) => order.documentId === orderId);
    }
  } catch (error) {
    console.error("Error reading guest orders from localStorage:", error);
  }
  return undefined;
}

export default function OrderDetails({
  orderId,
  order,
  isGuest,
}: OrderDetailsProps) {
  const [orderData, setOrderData] = useState<Order | undefined>(order);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    if (isGuest) {
      const guestOrder = getGuestOrderFromLocalStorage(orderId);
      setOrderData(guestOrder);
    }
  }, [isGuest, orderId]);

  // If the user has mounted and there is no order data, show a not found message
  if (hasMounted && !orderData) {
    return (
      <section className="space-y-10 h-[50vh] flex items-center justify-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-light uppercase text-center tracking-tight">
            Order Not Found
          </h1>
          <p className="text-center">
            The order with ID <strong>#{orderId}</strong> could not be found.
          </p>
        </div>
      </section>
    );
  }

  // If the user has not mounted yet, show a loading skeleton
  // This is useful for guest users or when the order data is being fetched
  if (!hasMounted) {
    return (
      <section className="space-y-10">
        <div className="space-y-2">
          <h1 className="text-4xl font-light uppercase text-center tracking-tight">
            Order #<Skeleton className="inline-block w-[100px] h-6" />
          </h1>
          <p className="text-center">
            Check the status of your order, manage returns, and discover
          </p>
        </div>
        <OrderSkeleton mode="details" />
      </section>
    );
  }

  return (
    <section className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-4xl font-light uppercase text-center tracking-tight">
          Order #
          <span className="font-semibold">{orderData?.order_number}</span>
        </h1>
        <p className="text-center">
          Check the status of your order, manage returns, and discover
        </p>
      </div>
      <div key={orderData?.documentId} className="mb-20">
        <OrderDetailsSummary order={orderData} />
        <OrderTable>
          {orderData?.order_items?.map((item: OrderItemType) => (
            <OrderItem key={item.id} item={item} />
          ))}
        </OrderTable>
      </div>
    </section>
  );
}
