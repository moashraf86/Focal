import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useCart } from "@/hooks/useCart";
export default function CheckoutBox() {
  const { user } = useUser();
  const { getTotalPrice } = useCart();
  const email = user?.emailAddresses[0]?.emailAddress;
  const name = user?.fullName;

  return (
    <div className="space-y-4 border p-6 col-span-3 lg:col-span-1 max-h-fit lg:sticky lg:top-20">
      <div className="flex justify-between items-center w-full">
        <p className="text-xl uppercase tracking-widest font-semibold">Total</p>
        <span className="text-xl font-semibold">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(getTotalPrice())}
        </span>
      </div>
      <p className="text-sm">Taxes and shipping calculated at checkout.</p>
      {/* Order notes */}
      <Textarea placeholder="Order notes" />
      <Button asChild variant="emphasis" className="w-full" size="lg">
        <Link
          prefetch={false}
          href={`checkout?amount=${getTotalPrice()}&email=${email}&name=${name}`}
        >
          Checkout
        </Link>
      </Button>
    </div>
  );
}
