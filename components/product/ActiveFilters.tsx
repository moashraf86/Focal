import { X } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter } from "@/lib/definitions";

export default function ActiveFilters({
  activeFilters,
}: {
  activeFilters: Filter[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Remove a filter from the URL and update the state
  const handleFilterRemove = (filter: Filter) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(filter.name, filter.value);
    if (filter.name === "price") {
      params.delete("price_min");
      params.delete("price_max");
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center flex-wrap gap-2 py-5 px-6 md:px-10">
      {activeFilters.map((filter) => {
        return (
          <Button
            key={filter.value}
            onClick={() => handleFilterRemove(filter)}
            className="flex items-center gap-2 px-3 py-1 text-sm font-barlow font-light tracking-[1px] bg-gray-100 hover:bg-gray-200 text-primary focus:outline-none focus:ring-1 focus:ring-ring capitalize shadow-none"
          >
            {filter.value}
            <X className="h-4 w-4" />
          </Button>
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
