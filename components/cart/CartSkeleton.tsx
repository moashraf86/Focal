import { Skeleton } from "../ui/skeleton";
import CartSkeletonItem from "./CartSkeletonItem";

export default function CartSkeleton() {
  return (
    <>
      <div className="space-y-6 col-span-3 lg:col-span-2">
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="border border-border overflow-hidden">
                <table className="min-w-full sm:divide-y divide-gray-200">
                  <thead className="hidden sm:table-header-group">
                    <tr>
                      <th scope="col" className="p-6 flex items-center">
                        <Skeleton className="h-3 w-16" />
                      </th>
                      <th scope="col" className="p-6">
                        <Skeleton className="h-3 w-16 m-auto" />
                      </th>
                      <th scope="col" className="p-6">
                        <Skeleton className="h-3 w-14 m-auto" />
                      </th>
                      <th
                        scope="col"
                        className="p-6 text-end text-xs font-medium uppercase"
                      ></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {Array.from({ length: 2 }).map((_, index) => (
                      <CartSkeletonItem key={index} />
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between mt-4">
                <Skeleton className="h-2 w-48" />
                <Skeleton className="h-8 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4 border p-6 max-h-fit col-span-3 lg:col-span-1">
        <div className="flex justify-between items-center w-full">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-2 w-3/4" />
        <Skeleton className="h-[60px] w-full bg-transparent border border-border" />
        <Skeleton className="h-12 w-full animate-none" />
      </div>
    </>
  );
}
