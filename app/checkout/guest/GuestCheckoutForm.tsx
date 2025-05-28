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

// create form schema
const formSchema = z.object({
  contact: z
    .string()
    .trim()
    .refine(
      (value) =>
        /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) ||
        /^(\+2)?01[0-2,5][0-9]{8}$/.test(value),
      {
        message: "Please enter a valid email or Egyptian phone number",
      }
    ),
  firstName: z
    .string()
    .min(1, {
      message: "First name is required",
    })
    .max(50, {
      message: "First name must be less than 50 characters",
    }),
  lastName: z
    .string()
    .min(1, {
      message: "Last name is required",
    })
    .max(50, {
      message: "Last name must be less than 50 characters",
    }),
  address: z
    .string()
    .min(1, {
      message: "Address is required",
    })
    .max(100, {
      message: "Address must be less than 100 characters",
    }),
  apartment: z
    .string()
    .max(50, {
      message: "Apartment, suite, etc. must be less than 50 characters",
    })
    .or(z.literal("")),
  city: z
    .string()
    .min(1, {
      message: "City is required",
    })
    .max(50, {
      message: "City must be less than 50 characters",
    }),
  state: z.enum([...egyptStates] as [string, ...string[]], {
    required_error: "State is required",
  }),
  postal_code: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{5}$/.test(val), {
      message: "postal_code code must be exactly 5 digits",
    }),
});

export default function GuestCheckoutForm() {
  const router = useRouter();

  // 1. Initialize form with useForm hook
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // 1. Load cart items from local storage
    const cartItems = loadFromLocalStorage();
    // 2. create new order object
    const newOrder = {
      orderItems: cartItems,
      shipping_address: {
        line1: data.address,
        line2: data.apartment,
        city: data.city,
        state: data.state,
        country: "Egypt",
        postal_code: data.postal_code,
      },
      createdAt: new Date().toISOString(),
      orderId: crypto.randomUUID().slice(0, 8),
    };
    // 3. get existing orders from local storage, if any
    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    // 4. check if order with same orderId already exists, if so, merge the new order with the existing one
    const updatedOrders = [...existingOrders, newOrder];
    // 5. store the new order in local storage
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    // 6. clear cart items from local storage
    localStorage.removeItem("cart_items");
    // 7. clear cart items from SWR cache
    mutate("guest-cart", [], false);
    // 8. redirect to payment confirmation page with orderId
    router.push("/payment-confirm?orderId=" + newOrder.orderId);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-10">
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
                    <SelectContent>
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
