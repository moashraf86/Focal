import { Skeleton } from "../ui/skeleton";

export default function CartSkeletonItem() {
  return (
    <tr>
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <Skeleton className="w-[100px] h-[125px] sm:w-[100px] sm:h-[100px] min-w-[100px]" />
          <div className="space-y-3 w-full">
            <Skeleton className="h-3 w-[100%] max-w-40 md:max-w-44" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-12" />
            <div className="flex justify-between items-center sm:hidden">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 hidden sm:table-cell">
        <Skeleton className="h-6 w-20 m-auto" />
      </td>
      <td className="px-6 py-4 hidden sm:table-cell">
        <Skeleton className="h-3 w-14 m-auto" />
      </td>
      <td className="px-6 py-4 hidden sm:table-cell">
        <Skeleton className="h-6 w-6 ms-auto" />
      </td>
    </tr>
  );
}
