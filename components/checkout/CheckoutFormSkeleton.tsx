import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutFormSkeleton() {
  return (
    <form className="space-y-6 px-6 py-8 lg:p-10 max-w-[40rem] mx-auto lg:ms-auto">
      {/* Shipping Skeleton */}
      <section className="space-y-3">
        <h2 className="text-xl font-light uppercase tracking-tight">
          Shipping
        </h2>
        <p className="text-sm">Delivery time: 3-5 business days</p>
        {/* Address Fields */}
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-md" /> {/* Full name */}
          <Skeleton className="h-10 w-full rounded-md" /> {/* Country/Region */}
          <Skeleton className="h-10 w-full rounded-md" /> {/* Address line 1 */}
        </div>
      </section>

      {/* Payment Skeleton */}
      <section className="space-y-3">
        <h2 className="text-xl  font-light uppercase tracking-tight">
          Payment
        </h2>
        <p className="text-sm">We accept all major credit cards.</p>
        {/* Card block */}
        <div className="space-y-4 border rounded-md p-4">
          <Skeleton className="h-5 w-24" /> {/* Card tab */}
          <Skeleton className="h-10 w-full" /> {/* Card number */}
          <div className="flex gap-4">
            <Skeleton className="h-10 w-1/2" /> {/* Expiration */}
            <Skeleton className="h-10 w-1/2" /> {/* CVC */}
          </div>
          <Skeleton className="h-5 w-64" /> {/* Billing is same */}
        </div>
      </section>

      {/* Pay Button */}
      <Skeleton className="h-12 w-full rounded-md" />
    </form>
  );
}
