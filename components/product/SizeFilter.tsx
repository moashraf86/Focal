import { useEffect, useMemo, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import { Size } from "@/lib/definitions";
import { useRouter, useSearchParams } from "next/navigation";

type SizeFilterProps = {
  sizes: Size[];
  availableSizes: Size[];
};

// Helper function to filter out sizes with null values
function processSizesForFilter(sizes: Size[]) {
  const actualSizes = sizes.filter(
    (size) =>
      size.value !== null && size.value !== "" && size.value !== undefined
  );
  const nonSizedCount = sizes.length - actualSizes.length;

  return {
    actualSizes,
    hasNonSizedProducts: nonSizedCount > 0,
    nonSizedCount,
  };
}

export default function SizeFilter({ sizes, availableSizes }: SizeFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  // size filter data
  const sizeFilterData = useMemo(() => {
    return {
      all: processSizesForFilter(sizes),
      available: processSizesForFilter(availableSizes),
    };
  }, [sizes, availableSizes]);

  // Update the URL query parameters based on selected filters
  const updateQueryParam = (key: string, values: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    values.forEach((value) => params.append(key, value));
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Handle size filter changes
  const handleSizeChange = (size: string) => {
    //TODO: Scroll to the products section
    const current = new Set(selectedSizes);
    if (current.has(size)) {
      current.delete(size);
    } else {
      current.add(size);
    }
    const newSelected = Array.from(current);
    setSelectedSizes(newSelected);
    updateQueryParam("size", newSelected);
  };

  useEffect(() => {
    const sizeParam = searchParams.getAll("size");
    if (sizeParam) {
      setSelectedSizes(sizeParam);
    }
  }, [searchParams]);

  return (
    <div className="space-y-3">
      {sizeFilterData.all.actualSizes.map((size) => {
        const isAvailable = sizeFilterData.available.actualSizes.some(
          (sizeObj) => sizeObj.value === size.value
        );
        const isSelected = selectedSizes.includes(size.value);

        return (
          <div
            key={size.id}
            className={cn("flex items-center gap-2 p-1", {
              "opacity-50 [&>label]:cursor-not-allowed": !isAvailable,
            })}
          >
            <Checkbox
              className="disabled:cursor-not-allowed disabled:bg-gray-400"
              id={size.value}
              onCheckedChange={() => handleSizeChange(size.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleSizeChange(size.value)
              }
              checked={isSelected}
              disabled={!isAvailable}
            />
            <label
              htmlFor={size.value}
              className="font-barlow text-sm cursor-pointer"
            >
              {size.value} ({size.count})
            </label>
          </div>
        );
      })}
    </div>
  );
}
