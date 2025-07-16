import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const paymentMethodId = searchParams.get("paymentMethodId");

  if (!paymentMethodId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    return NextResponse.json({ paymentMethod });
  } catch (error) {
    console.error("Error retrieving payment method:", error);
    return NextResponse.json(
      { error: "Failed to retrieve payment method" },
      { status: 500 }
    );
  }
}
