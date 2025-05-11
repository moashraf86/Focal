"use client";

import { ListFilter, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Checkbox } from "../ui/checkbox";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Color, Size } from "@/lib/definitions";
import ColorSelector from "./ColorSelector";
import { useWindowScroll } from "@uidotdev/usehooks";
import { buildActiveFilters, cn } from "@/lib/utils";
import PriceFilter from "./PriceFilter";
import Link from "next/link";

type ProductsFilterProps = {
  sizes: Size[];
  colors: Color[];
  availableSizes: { id: string; value: string | undefined; colors: Color[] }[];
  availableColors: { id: string; name: string | undefined }[];
};

type Filter = {
  name: string;
  value: string | null | undefined;
  removeUrl: string;
};

const MIN_PRICE = 100;
const MAX_PRICE = 1000;

const DEFAULT_RANGE: [number, number] = [MIN_PRICE, MAX_PRICE];
export default function ProductsFilter({
  sizes,
  colors,
  availableSizes,
  availableColors,
}: ProductsFilterProps) {
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
  const [filtersCount, setFiltersCount] = useState(0);
  const [range, setRange] = useState<[number, number]>(DEFAULT_RANGE);
  const searchParams = useSearchParams();
  const router = useRouter();

  const ref = useRef<HTMLButtonElement>(null);
  const [{ y: pageScrollY }, scrollTo] = useWindowScroll();

  const scrollToProducts = () => {
    scrollTo({
      top: ref.current
        ? ref.current.getBoundingClientRect().top + (pageScrollY ?? 0) - 100
        : pageScrollY,
      behavior: "smooth",
    });
  };

  const updateQueryParam = (key: string, values: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    values.forEach((value) => params.append(key, value));
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleSizeChange = (size: string) => {
    scrollToProducts();
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

  const handleColorChange = (colors: string | string[]) => {
    scrollToProducts();
    const newSelected = Array.isArray(colors) ? colors : [colors];
    setSelectedColors(newSelected);
    updateQueryParam("color", newSelected);
  };

  const commitRangeChange = (newRange: [number, number]) => {
    setRange(newRange as [number, number]);
    const params = new URLSearchParams(searchParams.toString());
    params.set("price_min", newRange[0].toString());
    params.set("price_max", newRange[1].toString());
    router.replace(`?${params.toString()}`, { scroll: false });
    scrollToProducts();
  };

  useEffect(() => {
    const sizeValues = searchParams.getAll("size");
    const colorValues = searchParams.getAll("color");
    const priceMin = parseInt(
      searchParams.get("price_min") ?? MIN_PRICE.toString()
    );
    const priceMax = parseInt(
      searchParams.get("price_max") ?? MAX_PRICE.toString()
    );
    setSelectedSizes(sizeValues);
    setSelectedColors(colorValues);
    setRange([priceMin, priceMax]);

    // Adjust the range if it exceeds the limits
    const priceRange = [
      (priceMin === MIN_PRICE && priceMax !== MAX_PRICE) ||
      (priceMax === MAX_PRICE && priceMin !== MIN_PRICE) ||
      (priceMin !== MIN_PRICE && priceMax !== MAX_PRICE)
        ? `$${priceMin.toString()}` + " - " + `$${priceMax.toString()}`
        : null,
    ];
    const filters = buildActiveFilters({
      sizes,
      colors,
      searchParams,
      sizeValues,
      colorValues,
      priceRange,
    });
    setActiveFilters(filters);
    setFiltersCount(filters.length);
  }, [searchParams]);

  return (
    <>
      <Sheet>
        <SheetTrigger
          className="flex items-center gap-2 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-ring"
          ref={ref}
        >
          <ListFilter className="h-4 w-4 text-muted-foreground" />
          <span className="relative flex items-center gap-2 text-sm font-barlow">
            Show Filters{" "}
            {filtersCount > 0 && (
              <span className="flex items-center justify-center min-w-5 w-5 h-5 ps-1 pe-1 text-[9px] font-medium text-white bg-primary rounded-full">
                {filtersCount}
              </span>
            )}
          </span>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              <p className="relative flex items-center gap-2">
                Filters{" "}
                {filtersCount > 0 && (
                  <span className="flex items-center justify-center min-w-5 w-5 h-5 ps-1 pe-1 text-[9px] font-medium text-white bg-primary rounded-full">
                    {filtersCount}
                  </span>
                )}
              </p>
            </SheetTitle>
          </SheetHeader>
          <div className="px-6">
            {activeFilters.length > 0 && (
              <div className="flex items-center flex-wrap gap-2 py-5">
                {activeFilters.map((filter) => {
                  return (
                    <Link
                      key={filter.value}
                      href={filter?.removeUrl}
                      className="flex items-center gap-2 px-3 py-1 text-sm font-barlow font-light tracking-[1px] bg-gray-100 hover:bg-gray-200 text-primary focus:outline-none focus:ring-1 focus:ring-ring"
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
            )}
            <Accordion type="multiple">
              <AccordionItem value="size">
                <AccordionTrigger className="text-sm font-barlow font-semibold tracking-[1px] hover:no-underline py-5">
                  Watch Size
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {sizes.map((size) => {
                      const isAvailable = availableSizes?.some(
                        (sizeObj) => sizeObj.value === size.value
                      );
                      const isSelected = selectedSizes.includes(size.value);

                      return (
                        <div
                          key={size.id}
                          className={cn("flex items-center gap-2 p-1", {
                            "opacity-50 [&>label]:cursor-not-allowed":
                              !isAvailable,
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
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="color">
                <AccordionTrigger className="text-sm font-barlow font-semibold tracking-[1px] hover:no-underline py-5">
                  Strap Color
                </AccordionTrigger>
                <AccordionContent>
                  <ColorSelector
                    colors={colors}
                    availableColors={availableColors}
                    selectedColors={selectedColors}
                    onColorChange={handleColorChange}
                    mode="multiple"
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="price">
                <AccordionTrigger className="text-sm font-barlow font-semibold tracking-[1px] hover:no-underline py-5">
                  <div className="flex items-center justify-between w-full">
                    Price
                    <span className="text-xs font-barlow font-light text-primary mr-1">
                      {range && range.map((price) => `$${price}`).join(" - ")}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <PriceFilter
                    range={range}
                    onRangeChange={commitRangeChange}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
