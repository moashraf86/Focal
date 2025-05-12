import { cn } from "@/lib/utils";
import { Color } from "@/lib/definitions";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type ColorSelectorProps = {
  colors: Color[];
  selectedColors?: string[];
  mode: "single" | "multiple";
  availableColors?: Color[];
};

export default function ColorSelector({
  colors,
  selectedColors,
  mode = "multiple",
  availableColors = [],
}: ColorSelectorProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedColorsState, setSelectedColorsState] = useState<string[]>(
    selectedColors || []
  );

  const updateQueryParam = (key: string, values: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    values.forEach((value) => params.append(key, value));
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Handle color selection
  const handleClick = (colorName: string) => {
    if (mode === "single") {
      setSelectedColorsState([colorName]);
      updateQueryParam("color", [colorName]);
    } else {
      const newSelectedColors = selectedColorsState.includes(colorName)
        ? selectedColorsState.filter((color) => color !== colorName)
        : [...selectedColorsState, colorName];

      setSelectedColorsState(newSelectedColors);
      updateQueryParam("color", newSelectedColors);
    }
  };

  useEffect(() => {
    const colorParam = searchParams.getAll("color");
    if (colorParam) {
      setSelectedColorsState(colorParam);
    }
  }, [searchParams]);

  return (
    <div className="grid grid-cols-[repeat(auto-fit,36px)] gap-3 p-1">
      {colors.map((color) => {
        const isAvailable =
          mode === "single"
            ? true
            : availableColors.some((c) => c.name === color.name);
        const isSelected =
          selectedColorsState?.includes(color.name) && isAvailable;

        return (
          <Button
            key={color.name}
            variant="outline"
            title={color.name}
            className={cn(
              "relative w-9 h-9 p-[1px] border-0 shadow-none",
              "after:absolute after:inset-[-3px] after:z-[-1]",
              "after:border-2 after:border-primary after:bg-transparent",
              "after:transition-all after:duration-200",
              {
                "after:scale-100 after:opacity-100": isSelected && isAvailable,
                "after:scale-90 after:opacity-0": !isSelected,
                "cursor-not-allowed": !isAvailable,
              }
            )}
            onClick={() => isAvailable && handleClick(color.name)}
            disabled={!isAvailable}
          >
            <Image
              src={color?.pattern?.url || ""}
              alt={color?.pattern?.alternativeText || "Pattern Image"}
              width={32}
              height={32}
              className="object-cover w-full h-full"
            />

            {/* Availability indicator */}
            {!isAvailable && (
              <span
                className="absolute top-0 right-0 w-[calc((100%*1.4142)-2px)] h-0.5 bg-white transform origin-right -rotate-45"
                hidden={isAvailable}
              ></span>
            )}
          </Button>
        );
      })}
    </div>
  );
}
