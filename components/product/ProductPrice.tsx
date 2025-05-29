"use client";
import { cn } from "@/lib/utils";

export default function ProductPrice({
  price,
  className,
}: {
  price: number;
  className?: string;
}) {
  return (
    <p className={cn("text-sm font-light text-foreground", className)}>
      {new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        currencyDisplay: "symbol",
        minimumFractionDigits: price % 1 === 0 ? 0 : 2,
        maximumFractionDigits: price % 1 === 0 ? 0 : 2,
      }).format(price)}
    </p>
  );
}
