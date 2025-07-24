import { Color, Filter, Product, Size } from "./definitions";
import { ReadonlyURLSearchParams } from "next/navigation";
import { MAX_PRICE, MIN_PRICE } from "./constants";

// ============================================
// Build active filters for the products page
// ============================================
export function buildActiveFilters({
  sizes,
  colors,
  searchParams,
  sizeValues,
  colorValues,
  priceMin,
  priceMax,
  collectionValues,
}: {
  sizes: Size[];
  colors: Color[];
  searchParams: ReadonlyURLSearchParams;
  sizeValues: string[];
  colorValues: string[];
  priceMin: number;
  priceMax: number;
  collectionValues: string[];
}): Filter[] {
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
    };
  });

  // Adjust the range if it exceeds the limits
  const priceRange = [
    (priceMin === MIN_PRICE && priceMax !== MAX_PRICE) ||
    (priceMax === MAX_PRICE && priceMin !== MIN_PRICE) ||
    (priceMin !== MIN_PRICE && priceMax !== MAX_PRICE)
      ? `$${priceMin.toString()}` + " - " + `$${priceMax.toString()}`
      : undefined,
  ];

  const priceFilter = priceRange.map((price) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("price_min");
    params.delete("price_max");
    return {
      name: "price",
      value: price,
    };
  });
  const collectionFilter = collectionValues.map((collection) => {
    const collectionObj = collectionValues.find((c) => c === collection);
    const params = new URLSearchParams(searchParams.toString());
    const hasCollection = params.has("collection", collection);
    if (hasCollection) {
      params.delete("collection", collection);
    }
    return {
      name: "collection",
      value: collectionObj,
    };
  });

  // remove null values from the array
  const filters = [
    ...sizeFilter,
    ...colorFilter,
    ...priceFilter,
    ...collectionFilter,
  ].filter((filter) => filter.value !== undefined);
  return filters;
}

// ================================
// Get all sizes in products page
// ================================
export function getAllSizes({ allSizesData }: { allSizesData: Size[] }) {
  // Deduplicate sizes by value
  const uniqueSizesMap = new Map();
  allSizesData.forEach((size) => {
    if (!uniqueSizesMap.has(size.value)) {
      uniqueSizesMap.set(size.value, {
        id: crypto.randomUUID().slice(0, 3),
        value: size.value,
        count: allSizesData.filter((s) => s.value === size.value).length,
        colors: size.colors,
      });
    }
  });
  const allSizes = Array.from(uniqueSizesMap.values());

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

// =========================================
// Get All Collections
// ==========================================
export function getAllCollections({
  allCollectionsData,
}: {
  allCollectionsData: { slug: string; name: string }[];
}) {
  const allCollectionsMap = new Map();
  allCollectionsData.forEach((collection) => {
    if (!allCollectionsMap.has(collection.slug)) {
      allCollectionsMap.set(collection.slug, {
        id: crypto.randomUUID().slice(0, 3),
        slug: collection.slug,
        name: collection.name,
        count: allCollectionsData.filter((c) => c.slug === collection.slug)
          .length,
      });
    }
  });
  const allCollections = Array.from(allCollectionsMap.values());
  return allCollections;
}

// ===============================================
// Get available collections for the selected size
// ===============================================
export function getAvailableCollections({
  availableProducts,
}: {
  availableProducts: Product[];
}) {
  const availableCollectionsMap = new Map();
  availableProducts
    .flatMap((product) => product.collections)
    .forEach((collection) => {
      if (!availableCollectionsMap.has(collection.slug)) {
        availableCollectionsMap.set(collection.slug, {
          id: crypto.randomUUID().slice(0, 3),
          slug: collection.slug,
          name: collection.name,
          count: availableProducts.filter((p) =>
            p.collections.some((c) => c.slug === collection.slug)
          ).length,
        });
      }
    });
  const availableCollections = Array.from(availableCollectionsMap.values());
  return availableCollections;
}

// =========================================
// Expanded Products Logic
// =========================================
export function expandProducts(
  products: Product[],
  selectedSize?: string | string[] | undefined,
  selectedColor?: string | string[] | undefined
): {
  product: Product;
  color?: string;
}[] {
  const selectedColors = Array.isArray(selectedColor)
    ? selectedColor
    : selectedColor
      ? [selectedColor]
      : [];

  const size = Array.isArray(selectedSize) ? selectedSize[0] : selectedSize;

  const expandedProducts: {
    product: Product;
    color?: string;
  }[] = [];

  for (const product of products) {
    const matchedColors: Set<string> = new Set();

    if (size) {
      const chosenSize = product.sizes?.find((s) => s.value === size);
      if (chosenSize && selectedColors.length > 0) {
        chosenSize.colors?.forEach((colorObj) => {
          if (selectedColors.includes(colorObj.name)) {
            matchedColors.add(colorObj.name);
          }
        });
      }

      const uniqueColors = Array.from(matchedColors);
      if (uniqueColors.length > 0) {
        for (const color of uniqueColors) {
          expandedProducts.push({ product, color });
        }
      } else {
        expandedProducts.push({ product }); // fallback
      }
    } else {
      product.sizes?.forEach((s) => {
        s.colors?.forEach((colorObj) => {
          if (selectedColors.includes(colorObj.name)) {
            matchedColors.add(colorObj.name);
          }
        });
      });

      const uniqueColors = Array.from(matchedColors);
      if (uniqueColors.length > 0) {
        for (const color of uniqueColors) {
          expandedProducts.push({ product, color });
        }
      } else {
        expandedProducts.push({ product });
      }
    }
  }

  return expandedProducts;
}

// =========================================
// Analyze product structure
// =========================================
export function analyzeProductStructure(product: Product) {
  const sizes = Array.isArray(product.sizes) ? product.sizes : [];

  // Check if we have actual sizes (non-null, non-empty values)
  const actualSizes = sizes.filter(
    (size) =>
      size.value !== null && size.value !== "" && size.value !== undefined
  );
  const hasActualSizes = actualSizes.length > 0;

  // Get colors based on structure
  let availableColors: Color[] = [];

  if (hasActualSizes) {
    // Product has real sizes, colors come from size selection
    availableColors = actualSizes[0]?.colors || [];
  } else if (
    sizes.length > 0 &&
    Array.isArray(sizes[0]?.colors) &&
    sizes[0].colors.length > 0
  ) {
    // Product has no sizes but colors are stored in the first size entry (your current case)
    availableColors = sizes[0].colors;
  }

  return {
    hasActualSizes,
    actualSizes,
    availableColors,
    hasColors: availableColors.length > 0,
    // Debug info (remove in production)
    debug: {
      sizesLength: sizes.length,
      firstSizeValue: sizes[0]?.value,
      firstSizeColorsLength: sizes[0]?.colors?.length || 0,
    },
  };
}

// =========================================
// Get colors for the selected size
// =========================================
export function getColorsForSize(product: Product, sizeValue?: string) {
  const { hasActualSizes, actualSizes, availableColors } =
    analyzeProductStructure(product);

  if (!hasActualSizes) {
    // No actual sizes, return the available colors
    return availableColors;
  }

  if (!sizeValue) {
    return [];
  }

  const sizeObj = actualSizes.find((size) => size.value === sizeValue);
  return Array.isArray(sizeObj?.colors) ? sizeObj.colors : [];
}

// =========================================
// Get product images
// =========================================
export function getProductImages(
  product: Product,
  selectedSize?: string,
  selectedColor?: string
) {
  const { hasActualSizes, availableColors } = analyzeProductStructure(product);

  let colorsToSearch: Color[] = [];

  if (hasActualSizes && selectedSize) {
    colorsToSearch = getColorsForSize(product, selectedSize);
  } else {
    colorsToSearch = availableColors;
  }

  if (selectedColor && colorsToSearch.length > 0) {
    const colorObj = colorsToSearch.find(
      (color) => color.name === selectedColor
    );
    if (colorObj?.images && colorObj.images.length > 0) {
      return colorObj.images;
    }
  }

  // Fallback to product images
  return product.images ?? [];
}
