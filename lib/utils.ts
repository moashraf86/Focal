import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Color, Product, Size } from "./definitions";
import { ReadonlyURLSearchParams } from "next/navigation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================
// Build active filters for the products page
// ============================================
export function buildActiveFilters({
  sizes,
  colors,
  searchParams,
  sizeValues,
  colorValues,
  priceRange,
}: {
  sizes: Size[];
  colors: Color[];
  searchParams: ReadonlyURLSearchParams;
  sizeValues: string[];
  colorValues: string[];
  priceRange: (string | null)[];
}) {
  const sizeFilter = sizeValues.map((size) => {
    const sizeObj = sizes.find((s) => s.value === size);
    const params = new URLSearchParams(searchParams.toString());
    const hasSize = params.has("size", size);
    if (hasSize) {
      params.delete("size", size);
    }
    return {
      name: "size",
      value: sizeObj?.value,
      removeUrl: `?${params.toString()}`,
    };
  });

  const colorFilter = colorValues.map((color) => {
    const colorObj = colors.find((c) => c.name === color);
    const params = new URLSearchParams(searchParams.toString());
    const hasColor = params.has("color", color);
    if (hasColor) {
      params.delete("color", color);
    }
    return {
      name: "color",
      value: colorObj?.name,
      removeUrl: `?${params.toString()}`,
    };
  });

  const priceFilter = priceRange.map((price) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("price_min");
    params.delete("price_max");
    return {
      name: "price",
      value: price,
      removeUrl: `?${params.toString()}`,
    };
  });
  // remove null values from the array
  const filters = [...sizeFilter, ...colorFilter, ...priceFilter].filter(
    (filter) => filter.value !== null
  );
  return filters;
}

// ================================
// Get all sizes in products page
// ================================
export function getAllSizes({
  allSizesData,
  ALL_SIZES,
}: {
  allSizesData: Size[];
  ALL_SIZES: string[];
}) {
  const allSizes = ALL_SIZES.map((size: string) => {
    const matchingSizes = allSizesData.filter((s) => s.value === size);

    // Deduplicate colors by name
    const uniqueColorsMap = new Map();
    matchingSizes.forEach((s) => {
      s.colors?.forEach((color) => {
        if (!uniqueColorsMap.has(color.name)) {
          uniqueColorsMap.set(color.name, color);
        }
      });
    });

    return {
      id: crypto.randomUUID().slice(0, 3),
      value: size,
      count: matchingSizes.length,
      colors: Array.from(uniqueColorsMap.values()),
    };
  });
  return allSizes;
}

//============================================
// Get available sizes for the selected color
// ===========================================
export function getAvailableSizes({
  color,
  productsForAvailableSizes,
}: {
  color: string | string[] | undefined;
  productsForAvailableSizes: Product[];
}) {
  const selectedColors = Array.isArray(color) ? color : color ? [color] : [];
  const availableSizesMap = new Map();
  productsForAvailableSizes
    .flatMap((product) => product.sizes)
    .filter((size) =>
      selectedColors.length > 0
        ? size.colors?.some((color) => selectedColors.includes(color.name))
        : true
    )
    .forEach((size) => {
      if (!availableSizesMap.has(size.value)) {
        availableSizesMap.set(size.value, {
          id: crypto.randomUUID().slice(0, 3),
          value: size.value,
          count: size.count,
          colors: size.colors,
        });
      }
    });
  const availableSizes = Array.from(availableSizesMap.values());
  return availableSizes;
}

// ================================
// Get all colors in products page
// ================================
export function getAllColors({
  allColorsData,
}: {
  allColorsData: (Color | undefined)[];
}) {
  const allColorsMap = new Map();
  allColorsData.forEach((color) => {
    if (!allColorsMap.has(color?.name)) {
      allColorsMap.set(color?.name, {
        id: crypto.randomUUID().slice(0, 3),
        name: color?.name,
        pattern: color?.pattern,
        images: color?.images,
      });
    }
  });
  const allColors = Array.from(allColorsMap.values());
  return allColors;
}

// =========================================
// Get available colors for the selected size
// ==========================================
export function getAvailableColors({
  size,
  availableProducts,
}: {
  size: string | string[] | undefined;
  availableProducts: Product[];
}) {
  const availableColorsMap = new Map();
  const selectedSize = Array.isArray(size) ? size : size ? size : [];
  availableProducts
    .flatMap((p) =>
      selectedSize.length > 0
        ? p.sizes.filter((s) => selectedSize.includes(s.value))
        : p.sizes
    )
    .flatMap((s) => s.colors)
    .forEach((color) => {
      if (!availableColorsMap.has(color?.name)) {
        availableColorsMap.set(color?.name, {
          id: crypto.randomUUID().slice(0, 3),
          name: color?.name,
          pattern: color?.pattern,
          images: color?.images,
        });
      }
    });
  const availableColors = Array.from(availableColorsMap.values());
  return availableColors;
}
