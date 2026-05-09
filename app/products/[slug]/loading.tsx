import ProductDetailsSkeleton from "@/components/product/ProductDetailsSkeleton";
import { ProductInfoSkeleton } from "@/components/product/ProductInfoSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div className="container max-w-screen-xl py-4">
        {/* BreadCrumb Skeleton */}
        <div className="flex items-center space-x-2 py-6">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>
        <ProductDetailsSkeleton />
        <ProductInfoSkeleton />
      </div>
    </>
  );
}
