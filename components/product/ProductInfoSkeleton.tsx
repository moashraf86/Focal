import { Skeleton } from "../ui/skeleton";

export const ProductInfoSkeleton = () => {
  return (
    <div className="container max-w-screen-xl mb-12 lg:mb-20">
      {/* ── DESKTOP (lg+) ── two-column layout */}
      <div className="hidden lg:grid grid-cols-12 gap-16">
        {/* Left: tabs + description text */}
        <div className="col-span-7 space-y-6">
          {/* Tab bar */}
          <div className="flex gap-8 border-b border-gray-200 pb-0">
            <Skeleton className="h-5 w-28 mb-3" />
            <Skeleton className="h-5 w-36 mb-3" />
          </div>
          {/* Description heading */}
          <Skeleton className="h-7 w-48" />
          {/* Body paragraphs */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
          </div>
          {/* Bullet list */}
          <div className="space-y-2 pl-4">
            <Skeleton className="h-4 w-52" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-44" />
          </div>
          {/* Additional paragraph */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          {/* Note paragraph */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          {/* Bottom links */}
          <div className="flex gap-6 pt-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        {/* Right: Buy With */}
        <div className="col-span-5 space-y-4">
          <Skeleton className="h-5 w-24" />
          <div className="grid grid-cols-2 gap-4">
            {/* Product card 1 */}
            <div className="space-y-3">
              <Skeleton className="h-64 w-full rounded-none" />
              <Skeleton className="h-4 w-40 mx-auto" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </div>
            {/* Product card 2 */}
            <div className="space-y-3">
              <Skeleton className="h-64 w-full rounded-none" />
              <Skeleton className="h-4 w-44 mx-auto" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE (< lg) ── single column */}
      <div className="lg:hidden space-y-0">
        {/* Buy With section */}
        <div className="space-y-4 mb-8">
          <Skeleton className="h-5 w-24" />
          <div className="grid grid-cols-2 gap-4">
            {/* Product card 1 */}
            <div className="space-y-3">
              <Skeleton className="h-56 w-full rounded-none" />
              <Skeleton className="h-4 w-36 mx-auto" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </div>
            {/* Product card 2 */}
            <div className="space-y-3">
              <Skeleton className="h-56 w-full rounded-none" />
              <Skeleton className="h-4 w-40 mx-auto" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </div>
          </div>
        </div>

        {/* Accordion rows */}
        <div className="border-t border-gray-200">
          {/* Description row */}
          <div className="flex items-center justify-between py-5 border-b border-gray-200">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-5" />
          </div>
          {/* Shipping & Returns row */}
          <div className="flex items-center justify-between py-5 border-b border-gray-200">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-5 w-5" />
          </div>
        </div>

        {/* Bottom links */}
        <div className="flex gap-6 pt-6">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
};
