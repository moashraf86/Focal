import { Skeleton } from "@/components/ui/skeleton"; // Adjust import based on your setup

export default function OrderConfirmSkeleton() {
  return (
    <div className="container max-w-xl">
      <div className="flex flex-col items-start justify-center gap-8 min-h-[calc(100vh-100px)] mx-auto py-10">
        {/* Header Section */}
        <div className="space-y-4 w-full">
          <Skeleton className="w-36 h-3" /> {/* "Payment Successful" */}
          <Skeleton className="w-80 h-10" /> {/* "Thanks for ordering" */}
          <div className="space-y-2">
            <Skeleton className="w-full max-w-md h-4" />
            <Skeleton className="w-3/4 max-w-md h-4" />
          </div>
        </div>

        {/* Order Items List */}
        <ul className="space-y-4 divide-y divide-border w-full">
          {/* Simulate 2-3 items for realism */}
          {[...Array(1)].map((_, index) => (
            <li
              key={index}
              className="flex justify-between items-start w-full pt-4 first:pt-0"
            >
              <div className="flex items-center gap-4">
                {/* Image */}
                <div className="border border-border rounded-md relative">
                  <Skeleton className="w-16 h-16 rounded" />
                  <Skeleton className="absolute -top-2 -right-2 w-4 h-4 rounded-full" />
                </div>
                {/* Item Details */}
                <div className="space-y-2">
                  <Skeleton className="w-48 h-4" /> {/* Product name */}
                  <Skeleton className="w-20 h-2" /> {/* Size/Color */}
                  <Skeleton className="w-16 h-2" /> {/* Price */}
                </div>
              </div>
              {/* Total Price */}
              <Skeleton className="w-12 h-3" />
            </li>
          ))}
        </ul>

        {/* Subtotal */}
        <div className="flex items-center justify-between w-full border-t border-border pt-4">
          <Skeleton className="w-28 h-3" /> {/* "Subtotal · X items" */}
          <Skeleton className="w-12 h-3" /> {/* Subtotal amount */}
        </div>

        {/* Shipping Fees */}
        <div className="flex items-center justify-between w-full">
          <Skeleton className="w-24 h-3" /> {/* "Shipping fees" */}
          <Skeleton className="w-12 h-3" /> {/* "Free" */}
        </div>

        {/* Total */}
        <div className="flex items-center justify-between w-full">
          <Skeleton className="w-20 h-5" /> {/* "Total" */}
          <Skeleton className="w-14 h-5" /> {/* Total amount */}
        </div>

        {/* Shipping Address */}
        <div className="flex items-start justify-between w-full border-t border-border py-4">
          <Skeleton className="w-32 h-4" /> {/* "Shipping Address" */}
          <div className="space-y-2 flex flex-col items-end">
            <Skeleton className="w-12 h-3" /> {/* Line 1 */}
            <Skeleton className="w-12 h-3" /> {/* Line 2 */}
            <Skeleton className="w-48 h-3" />{" "}
            {/* City, State, Postal, Country */}
            <Skeleton className="w-28 h-3" /> {/* Contact */}
          </div>
        </div>

        {/* Payment Information */}
        <div className="flex items-start justify-between w-full">
          <Skeleton className="w-36 h-4" /> {/* "Payment information" */}
          <div className="space-y-1 text-end">
            <Skeleton className="w-28 h-3" /> {/* Cash on delivery*/}
          </div>
        </div>

        {/* Continue Shopping Link */}
        <div className="self-end flex items-center gap-2">
          <Skeleton className="w-32 h-4" /> {/* "Continue Shopping" */}
          <Skeleton className="w-4 h-4" /> {/* ArrowRight icon */}
        </div>
      </div>
    </div>
  );
}
