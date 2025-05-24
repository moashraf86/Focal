"use client";

import { ListFilter } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
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
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Collection, Color, Filter, Size } from "@/lib/definitions";
import ColorSelector from "./ColorSelector";
import { useWindowScroll } from "@uidotdev/usehooks";
import { buildActiveFilters } from "@/lib/utils";
import PriceFilter from "./PriceFilter";
import SizeFilter from "./SizeFilter";
import CollectionFilter from "./CollectionFilter";
import ActiveFilters from "./ActiveFilters";
import { MAX_PRICE, MIN_PRICE } from "@/lib/constants";
import { Button } from "../ui/button";

type ProductsFilterProps = {
  sizes: Size[];
  colors: Color[];
  collections: Collection[];
  availableSizes: Size[];
  availableColors: Color[];
  availableCollections: Collection[];
  resultsCount: number;
};

export default function ProductsFilter({
  sizes,
  colors,
  availableSizes,
  availableColors,
  collections,
  availableCollections,
  resultsCount,
}: ProductsFilterProps) {
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
  const [filtersCount, setFiltersCount] = useState(0);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedColorsState, setSelectedColorsState] = useState<string[]>([]);

  const ref = useRef<HTMLButtonElement>(null);
  const [{ y: pageScrollY }, scrollTo] = useWindowScroll();

  // Scroll to the products section when filters are applied
  const scrollToProducts = () => {
    scrollTo({
      top: ref.current
        ? ref.current.getBoundingClientRect().top + (pageScrollY ?? 0) - 100
        : pageScrollY,
      behavior: "smooth",
    });
  };

  // Update the URL query parameters without reloading the page
  const updateQueryParam = (key: string, values: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    values.forEach((value) => params.append(key, value));
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Handle size selection
  const handleColorSelect = (colorName: string) => {
    const newSelectedColors = selectedColorsState.includes(colorName)
      ? selectedColorsState.filter((color) => color !== colorName)
      : [...selectedColorsState, colorName];

    setSelectedColorsState(newSelectedColors);
    updateQueryParam("color", newSelectedColors);
  };
  // Initialize selected colors from URL on first render
  useEffect(() => {
    const colorParam = searchParams.getAll("color");
    if (colorParam) {
      setSelectedColorsState(colorParam);
    }
  }, [searchParams]);

  // Get all the params values from the URL
  const sizeValues = searchParams.getAll("size");
  const colorValues = searchParams.getAll("color");
  const priceMin = parseInt(
    searchParams.get("price_min") ?? MIN_PRICE.toString()
  );
  const priceMax = parseInt(
    searchParams.get("price_max") ?? MAX_PRICE.toString()
  );
  const collectionValues = searchParams.getAll("collection");

  // Create active filters based on the URL params
  const filters = buildActiveFilters({
    sizes,
    colors,
    searchParams,
    sizeValues,
    colorValues,
    priceMin,
    priceMax,
    collectionValues,
  });

  useEffect(() => {
    setActiveFilters(filters);
    setFiltersCount(filters.length);
    // skip scrolling on first render
    if (typeof window === "undefined") return;

    // delay scroll just a bit to wait for re-render
    const timeout = setTimeout(() => {
      if (filters.length > 0) {
        console.log(filters.length);

        scrollToProducts();
      }
    }, 100);
    return () => clearTimeout(timeout);
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
          <div className="overflow-y-auto h-full">
            {activeFilters.length > 0 && (
              <ActiveFilters activeFilters={activeFilters} />
            )}
            <Accordion type="multiple" className="px-6 md:px-10">
              <AccordionItem value="size">
                <AccordionTrigger className="text-sm font-barlow font-semibold tracking-[1px] hover:no-underline py-5">
                  Watch Size
                </AccordionTrigger>
                <AccordionContent>
                  <SizeFilter sizes={sizes} availableSizes={availableSizes} />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="color">
                <AccordionTrigger className="text-sm font-barlow font-semibold tracking-[1px] hover:no-underline py-5">
                  Strap Color
                </AccordionTrigger>
                <AccordionContent>
                  <ColorSelector
                    mode="multiple"
                    colors={colors}
                    availableColors={availableColors}
                    selectedColors={selectedColorsState}
                    onColorSelect={handleColorSelect}
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="price">
                <AccordionTrigger className="text-sm font-barlow font-semibold tracking-[1px] hover:no-underline py-5">
                  <div className="flex items-center justify-between w-full">
                    Price
                    <span className="text-xs font-barlow font-light text-primary mr-1">
                      {`$${priceMin}`} - {`$${priceMax}`}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <PriceFilter />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="type">
                <AccordionTrigger className="text-sm font-barlow font-semibold tracking-[1px] hover:no-underline py-5">
                  Product Type
                </AccordionTrigger>
                <AccordionContent>
                  <CollectionFilter
                    collections={collections}
                    availableCollections={availableCollections}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <SheetFooter className="bg-[white] sticky bottom-0 z-10 px-6 md:px-10 before:absolute before:content-[''] before:w-full before:left-0 before:bottom-full before:h-6 before:bg-gradient-to-t before:from-[#FFF] before:to-transparent before:z-[1] before:pointer-events-none">
            <Button
              asChild
              variant="emphasis"
              type="button"
              size="lg"
              className="w-full mb-5 md:mb-10"
            >
              <SheetClose>View Results ({resultsCount})</SheetClose>
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
