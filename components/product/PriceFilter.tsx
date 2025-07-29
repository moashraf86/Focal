"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Slider } from "../ui/slider";
import { useEffect, useState } from "react";
import { DEFAULT_RANGE, MAX_PRICE, MIN_PRICE, STEP } from "@/lib/constants";

export default function PriceFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [range, setRange] = useState<[number, number]>(DEFAULT_RANGE);
  const [tempMin, setTempMin] = useState(range[0]);
  const [tempMax, setTempMax] = useState(range[1]);

  // Handle price range changes
  const handleRangeChange = (newRange: [number, number]) => {
    //TODO: Scroll to the products section
    setRange(newRange as [number, number]);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    params.set("price_min", newRange[0].toString());
    params.set("price_max", newRange[1].toString());
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handleBlurMin = () => {
    const newMin = Math.min(tempMin, range[1] - 1);
    const validatedMin =
      isNaN(newMin) || newMin < MIN_PRICE ? MIN_PRICE : newMin;
    handleRangeChange([validatedMin, range[1]]);
  };

  const handleBlurMax = () => {
    const newMax = Math.max(tempMax, range[0] + 1);
    const validatedMax =
      isNaN(newMax) || newMax > MAX_PRICE ? MAX_PRICE : newMax;
    handleRangeChange([range[0], validatedMax]);
  };

  // Sync inputs when parent range changes
  useEffect(() => {
    const priceMin = parseInt(
      searchParams.get("price_min") ?? MIN_PRICE.toString()
    );
    const priceMax = parseInt(
      searchParams.get("price_max") ?? MAX_PRICE.toString()
    );
    const newRange: [number, number] = [
      isNaN(priceMin) ? MIN_PRICE : priceMin,
      isNaN(priceMax) ? MAX_PRICE : priceMax,
    ];
    setRange(newRange);
    setTempMin(newRange[0]);
    setTempMax(newRange[1]);
  }, [searchParams]);

  return (
    <div className="space-y-4">
      <Slider
        min={MIN_PRICE}
        max={MAX_PRICE}
        step={STEP}
        value={range}
        onValueChange={handleRangeChange}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center border border-border col-span-1 px-2.5 py-2">
          <span className="font-barlow text-xs">$</span>
          <input
            type="number"
            name="min"
            inputMode="numeric"
            max={range[1] - STEP}
            value={tempMin}
            onChange={(e) => setTempMin(Number(e.target.value))}
            onBlur={handleBlurMin}
            onKeyDown={(e) => e.key === "Enter" && handleBlurMin()}
            className="text-sm text-right font-barlow appearance-none border-0 focus:outline-none focus:ring-0 w-full"
            placeholder="Min"
          />
        </div>

        <div className="flex items-center border border-border col-span-1 px-2.5 py-2">
          <span className="font-barlow text-xs">$</span>
          <input
            type="number"
            name="max"
            inputMode="numeric"
            max={MAX_PRICE}
            value={tempMax}
            onChange={(e) => setTempMax(Number(e.target.value))}
            onBlur={handleBlurMax}
            onKeyDown={(e) => e.key === "Enter" && handleBlurMax()}
            className="text-sm text-right font-barlow appearance-none border-0 focus:outline-none focus:ring-0 w-full"
            placeholder="Max"
          />
        </div>
      </div>
    </div>
  );
}
