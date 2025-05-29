"use client";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { egyptStates } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { loadFromLocalStorage } from "@/lib/localStorage";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
import { CartItem, GuestOrder } from "@/lib/definitions";
import { checkoutSchema } from "@/lib/schema";

export default function GuestCheckoutForm() {
  const router = useRouter();

  // 1. Initialize form with useForm hook
  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      contact: "",
      firstName: "",
      lastName: "",
      address: "",
      apartment: "",
      city: "",
      state: undefined,
      postal_code: "",
    },
  });
  // 2. Handle form submission
  const onSubmit = (data: z.infer<typeof checkoutSchema>) => {
    // 1. Load cart items from local storage
    const cartItems = loadFromLocalStorage();
    // 2. create new order object
    const newOrder = {
      order_items: cartItems,
      shipping_address: {
        line1: data.address,
        line2: data.apartment,
        city: data.city,
        state: data.state,
        country: "Egypt",
        postal_code: data.postal_code,
      },
      createdAt: new Date().toISOString(),
      order_number: crypto.randomUUID().slice(0, 8),
      documentId: crypto.randomUUID().replace(/-/g, "").slice(0, 12),
      amount: cartItems
        .reduce((acc: number, item: CartItem) => {
          return acc + item.product.price * item.quantity;
        }, 0)
        .toFixed(2),
      payment_method: {
        type: "cash",
      },
    };
    // 3. get existing orders from local storage, if any
    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    // 4. check if order with same orderId already exists, overwrite it if it does
    const orderIndex = existingOrders.findIndex(
      (order: GuestOrder) => order.order_number === newOrder.order_number
    );

    if (orderIndex !== -1) {
      // if order exists, merge the new order with the existing one
      existingOrders[orderIndex] = {
        ...existingOrders[orderIndex],
        ...newOrder,
      };
    } else {
      // if order does not exist, push the new order
      existingOrders.push(newOrder);
    }
    // 5. store the new order in local storage
    localStorage.setItem("orders", JSON.stringify(existingOrders));
    // 6. clear cart items from local storage
    localStorage.removeItem("cart_items");
    // 7. clear cart items from SWR cache
    mutate("guest-cart", [], false);
    // 8. redirect to payment confirmation page with orderId
    router.push("/payment-confirm?orderId=" + newOrder.documentId);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 px-6 py-8 lg:p-10 max-w-[40rem] mx-auto lg:ms-auto"
      >
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-semibold font-barlow tracking-wide">
            Contact
          </h2>
          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Email or Mobile phone number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-semibold font-barlow tracking-wide">
            Delivery
          </h2>
          <div className="flex gap-3">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="apartment"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Apartment, suite, etc. (optional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-3">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 rounded-md">
                        <SelectValue placeholder="Select a state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-md">
                      {egyptStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postal_code"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="Postal Code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>
        <section className="space-y-3">
          <h2 className="text-lg md:text-xl font-semibold font-barlow tracking-wide">
            Payment
          </h2>
          <div className="flex items-center gap-2 px-3 h-11 border border-primary rounded-md bg-muted font-medium">
            <div className="h-4 w-4 rounded-full border border-primary relative">
              <div className="h-2 w-2 bg-primary rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            </div>
            Cash on Delivery
          </div>
        </section>
        <Button
          type="submit"
          size="lg"
          variant="emphasis"
          className="w-full rounded-md"
        >
          Place Order
        </Button>
      </form>
    </Form>
  );
}
