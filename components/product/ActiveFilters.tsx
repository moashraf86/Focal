import { X } from "lucide-react";
import Link from "next/link";

type Filter = {
  name: string;
  value: string | null | undefined;
  removeUrl: string;
};

export default function ActiveFilters({
  activeFilters,
}: {
  activeFilters: Filter[];
}) {
  return (
    <div className="flex items-center flex-wrap gap-2 py-5">
      {activeFilters.map((filter) => {
        return (
          <Link
            key={filter.value}
            href={filter?.removeUrl}
            className="flex items-center gap-2 px-3 py-1 text-sm font-barlow font-light tracking-[1px] bg-gray-100 hover:bg-gray-200 text-primary focus:outline-none focus:ring-1 focus:ring-ring capitalize"
          >
            {filter.value}
            <X className="h-4 w-4" />
          </Link>
        );
      })}
      <Link
        href="/categories"
        className="text-sm font-barlow font-light tracking-[1px] underline underline-offset-2 focus:outline-none focus:ring-1 focus:ring-ring"
      >
        Clear All
      </Link>
    </div>
  );
}
