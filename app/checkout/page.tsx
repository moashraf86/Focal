"use client";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { useEffect, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51REAqGR8REY9Qf3chQKLYLdTTbUIUNZE877obnQmoiM56ZGbOpfprwfTPF7j5GuhthvgNhlJB9X5fffABj1JsnbY008wTPCoj7"
);

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");

  // get amount, email, name from searchParams
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount");
  const email = searchParams.get("email");
  const name = searchParams.get("name");

  const hasFechedRef = useRef(false);

  // fetch client secret
  const fetchClientSecret = async () => {
    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          email,
          name,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }

      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
    } catch (error) {
      console.error("Error fetching client secret:", error);
    }
  };

  useEffect(() => {
    // Check if the client secret has already been fetched
    if (hasFechedRef.current) return;
    hasFechedRef.current = true;

    // Fetch the client secret when the component mounts
    fetchClientSecret();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, email, name]);

  if (!clientSecret) {
    return <div>Loading...</div>;
  }
  // Pass the client secret to the CheckoutForm component
  const options = {
    clientSecret,
  };

  return (
    <div id="checkout">
      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm clientSecret={clientSecret} />
        </Elements>
      )}
    </div>
  );
}
