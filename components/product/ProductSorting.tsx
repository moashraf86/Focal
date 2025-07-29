"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { useRef, useState, useTransition } from "react";
import TopProgressBar from "../shared/TopProgressBar";
import { useWindowScroll } from "@uidotdev/usehooks";

export default function ProductSorting() {
  const searchParams = useSearchParams();
  const sortByParam = searchParams.get("sort_by");
  const URL = useRouter();
  const currentSort = searchParams.get("sort_by") || "createdAt:desc";

  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const [{ y: pageScrollY }, scrollTo] = useWindowScroll();
  const scrollToProducts = () => {
    scrollTo({
      top: ref.current
        ? ref.current.getBoundingClientRect().top + (pageScrollY ?? 0) - 100
        : pageScrollY,
      behavior: "smooth",
    });
  };
  // Define sorting options
  const sortingOptions = [
    { label: "Latest", value: "createdAt:desc" },
    { label: "Oldest", value: "createdAt:asc" },
    { label: "Price: Low to High", value: "price:asc" },
    { label: "Price: High to Low", value: "price:desc" },
    { label: "Alphabetically, A-Z", value: "name:asc" },
    { label: "Alphabetically, Z-A", value: "name:desc" },
  ];

  // Handle sorting change
  const handleSortingChange = (value: string) => {
    // Scroll to the top of the products section
    scrollToProducts();
    setIsLoading(true);
    // simulate a delay to show loading state
    setTimeout(() => {
      startTransition(() => {
        // create a new URLSearchParams object from the current search params
        const params = new URLSearchParams(searchParams.toString());
        // delete page parameter
        params.delete("page");
        // Clear old sorting
        params.delete("sort_by");
        // Add new sorting value
        params.set("sort_by", value);
        // Update URL
        URL.push(`?${params.toString()}`, { scroll: false });
      });
      setIsLoading(false);
    }, 350);
  };

  return (
    <>
      <TopProgressBar trigger={isLoading || isPending} />
      <div className="flex items-center gap-1" ref={ref}>
        <span className="hidden md:inline text-sm whitespace-nowrap text-gray-500">
          Sort by
        </span>
        <Select defaultValue={currentSort} onValueChange={handleSortingChange}>
          <SelectTrigger className="border-none gap-1">
            <span className="md:!hidden">Sort By</span>
            <span className="!hidden md:!inline-block text-sm font-barlow">
              {sortingOptions.find((option) => option.value === sortByParam)
                ?.label || "Latest"}
            </span>
          </SelectTrigger>
          <SelectContent align="end">
            {sortingOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <span className="text-sm font-barlow">{option.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
