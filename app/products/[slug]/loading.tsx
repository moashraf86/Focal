import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container max-w-screen-xl">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 py-6">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-[50px]" />
        <Skeleton className="h-4 w-[50px]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 mb-20">
        {/* Product Image */}
        <div className="w-full flex flex-col-reverse lg:flex-row gap-4 lg:col-span-7">
          <div className="grid grid-flow-col auto-cols-fr sm:auto-cols-max gap-2 p-2 lg:flex lg:flex-col">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                className="relative w-full aspect-square sm:w-28 sm:h-32 lg:w-16 lg:h-20 xl:w-20 xl:h-24 p-3"
              />
            ))}
          </div>
          <Skeleton className="w-full aspect-auto px-[50%] py-[62%] lg:p-0" />
        </div>
        {/* Product Info */}
        <div className="space-y-6 lg:col-span-5">
          {/* Title */}
          <Skeleton className="h-10 w-full" />
          {/* Price */}
          <Skeleton className="h-8 w-32" />
          {/* Rating */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-14" />
          </div>
          {/* Divider */}
          <div className="border-b border-border" />
          {/* Variant */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-12 w-20" />
              <Skeleton className="h-12 w-20" />
            </div>
          </div>
          {/* Quantity */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-12 w-[135px]" />
          </div>
          {/* Buttons */}
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
          {/* Accordion */}
          <div className="space-y-2">
            <div className="flex justify-between items-center py-4 border-b border-border">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-4" />
            </div>
            <div className="flex justify-between items-center py-4 border-b border-border">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
