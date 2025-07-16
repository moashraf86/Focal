import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function POST(req: NextRequest) {
  const { amount, email, name } = await req.json();

  // 1. search for existing customers with email
  const existingCustomer = await stripe.customers.list({
    email,
    limit: 1,
  });

  let customers;
  if (existingCustomer.data.length > 0) {
    customers = existingCustomer.data[0];
  } else {
    // 2. create a new customer
    customers = await stripe.customers.create({
      email,
      name,
    });
  }
  // 3. create a new payment method
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(amount * 100), // convert to dollars
    currency: "usd",
    customer: customers.id,
    payment_method_types: ["card"],
  });

  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
