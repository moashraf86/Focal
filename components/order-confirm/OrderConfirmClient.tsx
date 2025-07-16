"use client";

import ProductPrice from "@/components/product/ProductPrice";
import { fetchOrderById } from "@/lib/data";
import { GuestOrder, Order, OrderItem } from "@/lib/definitions";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import OrderConfirmSkeleton from "./OrderConfirmSkeleton";

export default function OrderConfirmClient({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | GuestOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // fetch order from local storage first
        const storedOrders = localStorage.getItem("orders");
        if (storedOrders) {
          const orders = JSON.parse(storedOrders);
          const order = orders.find(
            (order: GuestOrder) => order.documentId === orderId
          );
          if (order) {
            await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay for loading state
            setOrder(order);
            return;
          }
        }
        // if not found in local storage, fetch from API
        const orderData = await fetchOrderById(orderId);
        setOrder(orderData);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to fetch order details. Please try again later.");
      }
    };
    fetchOrder();
  }, [orderId]);

  // send confirmation email to customer
  useEffect(() => {
    if (!order) return;

    const sentKey = `sentEmail:${order.documentId}`; // unique per order

    const sendEmail = async () => {
      try {
        const name = order.name; // customer name
        const email = order.email;
        const total = order.amount || 0;
        const orderNumber = order.order_number;
        const orderId = order.documentId;

        // Prepare order items data for the API
        const orderItems = order.order_items.map((item: OrderItem) => {
          return {
            product: item.product,
            quantity: item.quantity,
            size: item.size,
            color: item.color || null,
            price: item.product.price,
          };
        });
        const shippingAddress = order.shipping_address;
        const paymentMethod = order.payment_method;

        const response = await fetch("/api/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderNumber,
            email,
            name,
            orderItems,
            total,
            orderId,
            shippingAddress,
            paymentMethod,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        localStorage.setItem(sentKey, "true");
      } catch (error) {
        console.error("Failed to send email:", error);
      }
    };

    // Only send email if not sent before for this order
    if (!localStorage.getItem(sentKey)) {
      sendEmail();
    }
  }, [order]);

  if (!order) {
    return <OrderConfirmSkeleton />;
  }

  if (error) {
    return (
      <div className="container max-w-xl mx-auto py-10">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

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
        <ul className="space-y-4 divide-y divide-border w-full">
          {order.order_items.map((item: OrderItem) => {
            // Find the selected image based on size and color
            const selectedImage =
              item.product?.sizes
                ?.find((size) => size.value === item.size)
                ?.colors?.find((color) => color.name === item.color)
                ?.images?.[0] ?? item.product?.images?.[0];
            return (
              <li
                key={item.documentId}
                className="flex justify-between items-start w-full pt-4 first:pt-0"
              >
                <div className="flex items-center gap-4">
                  <div className="border border-border rounded-md relative">
                    <Image
                      src={selectedImage.formats.small.url}
                      alt={item.product.name}
                      width={selectedImage.formats.small.width}
                      height={selectedImage.formats.small.height}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <span className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center bg-primary/50 text-xs text-white rounded-full p-2.5 font-semibold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <Link
                      href={`/products/${item.product.slug}?size=${item.size}&color=${item.color}`}
                      className="block text-sm font-semibold font-barlow leading-tight hover:underline underline-offset-2"
                    >
                      {item.product.name}
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      {item.size} {item.color ? `/ ${item.color}` : ""}
                    </span>{" "}
                    <ProductPrice
                      className="text-xs text-muted-foreground font-sans"
                      price={item.product.price}
                    />
                  </div>
                </div>
                <span className="text-sm font-semibold">
                  <ProductPrice
                    className="text-sm font-semibold font-sans"
                    price={item.product.price * item.quantity}
                  />
                </span>
              </li>
            );
          })}
        </ul>
        {/* Subtotal */}
        <div className="flex items-center justify-between w-full border-t border-border pt-4">
          <span className="text-sm font-semibold">
            Subtotal ·{" "}
            {order.order_items.reduce((acc, item) => acc + item.quantity, 0)}{" "}
            items
          </span>
          <ProductPrice
            className="text-sm font-semibold font-sans"
            price={order.amount}
          />
        </div>
        {/* Taxes */}
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-semibold">Shipping fees</span>
          <span className="text-sm font-semibold">Free</span>
        </div>
        <div className="flex items-center justify-between w-full">
          <span className="text-xl font-semibold">Total</span>
          <ProductPrice
            className="text-lg font-semibold"
            price={order.amount}
          />
        </div>
        {/* Shipping */}
        <div className="flex items-start justify-between w-full border-t border-border py-4">
          <span className="font-medium">Shipping Address</span>
          <div className="space-y-1 text-end">
            <p>{order.shipping_address.line1}</p>
            <p>{order.shipping_address.line2}</p>
            <p>
              {order.shipping_address.city}, {order.shipping_address.state},{" "}
              {order.shipping_address.postal_code},{" "}
              {order.shipping_address.country}
              {order.shipping_address.contact && (
                <>
                  <br />
                  {order.shipping_address.contact}
                </>
              )}
            </p>
          </div>
        </div>
        {/* Payment method */}
        <div className="flex items-start justify-between w-full">
          <span className="font-medium">Payment information</span>
          <div className="space-y-1 text-end">
            {order.payment_method?.type === "card" ? (
              <>
                <p>{order.payment_method?.card?.brand}</p>
                <p>Ending with {order.payment_method?.card?.last4}</p>
                <p>
                  Expires {order.payment_method?.card?.exp_month}/
                  {order.payment_method?.card?.exp_year.toString().slice(-2)}
                </p>
              </>
            ) : (
              <p>Cash on Delivery</p>
            )}
          </div>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 text-sky-600 hover:text-sky-500 self-end font-medium"
        >
          Continue Shopping
          <ArrowRight className="mt-1" size={16} />
        </Link>
      </div>
    </div>
  );
}
