import {
  fetchAllProducts,
  fetchAllProductsBase,
  fetchCategories,
} from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  expandProducts,
  getAllCollections,
  getAllColors,
  getAllSizes,
  getAvailableCollections,
  getAvailableColors,
  getAvailableSizes,
} from "@/lib/helper";
import Image from "next/image";
import Link from "next/link";
import ProductList from "../../components/product/ProductList";
import ProductSorting from "@/components/product/ProductSorting";
import ProductsFilter from "@/components/product/ProductsFilter";
import { cache } from "react";
import { Product } from "@/lib/definitions";
import { Metadata } from "next";
import SmartPagination from "@/components/ui/smartPagination";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse all products available in the Focal Store.",
  openGraph: {
    type: "website",
    title: "All Products",
    description: "Browse all products available in the Focal Store.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/opengraph/opengraph-all.jpg`,
      },
    ],
  },
};

// Cache data fetching functions
const getCachedCategories = cache(fetchCategories);
const getCachedAllProducts = cache(fetchAllProductsBase);

// Precompute filter options
const computeFilterOptions = (products: Product[]) => {
  const allSizesData = products.flatMap((product) => {
    // Check if product collections contain slug "strap" or "gift-set"
    const hasStrapOrGiftSetCollection = product.collections?.some(
      (collection) =>
        collection.slug === "strap" || collection.slug === "gift-set"
    );

    // Return empty array if it's a strap/gift-set product OR if sizes is undefined/null
    if (
      hasStrapOrGiftSetCollection ||
      !product.sizes ||
      !Array.isArray(product.sizes)
    ) {
      return [];
    }

    return product.sizes;
  });

  const allColorsData = allSizesData.flatMap((size) => size?.colors || []);
  const allCollectionsData = products.flatMap(
    (product) => product.collections || []
  );

  return {
    allSizes: getAllSizes({ allSizesData }),
    allColors: getAllColors({ allColorsData }),
    allCollections: getAllCollections({ allCollectionsData }),
  };
};

export default async function Categories({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { sort_by, size, color, price_min, price_max, collection, page } =
    await searchParams;

  const currentPage = page ? parseInt(page as string) : 1;

  // Check if any filters are applied
  const hasFilters = Boolean(
    size ||
      color ||
      price_min ||
      price_max ||
      collection ||
      (sort_by && sort_by !== "createdAt:desc")
  );

  // Fetch base data (heavily cached) - this is for the paginated display
  const [{ categories }, { products: allProducts, pagination }] =
    await Promise.all([
      getCachedCategories(),
      getCachedAllProducts(currentPage),
    ]);

  // Fetch ALL products without pagination for filter calculations
  // This ensures filters show all available options across the entire dataset
  const { products: allProductsForFilters } = await fetchAllProducts({
    // No pagination parameters - fetch all products
    sort: "createdAt:desc", // Use default sort for consistency
  });

  // Precompute filter options from ALL products (not just paginated results)
  const { allSizes, allColors, allCollections } = computeFilterOptions(
    allProductsForFilters
  );

  // Calculate pagination
  let totalPages = Math.ceil(pagination.total / pagination.limit);

  // Fetch filtered products only when needed
  let products = allProducts;
  let allFilteredProductsForSizes = allProductsForFilters;

  if (hasFilters) {
    const { products: filtered, pagination: filteredPagination } =
      await fetchAllProducts({
        sort: sort_by,
        size,
        color,
        price_min,
        price_max,
        collection,
        page: currentPage,
      });
    products = filtered;
    totalPages = Math.ceil(filteredPagination.total / filteredPagination.limit);

    // Fetch ALL products WITHOUT SIZE filter (no pagination) for size availability
    const { products: allFilteredWithoutSize } = await fetchAllProducts({
      sort: sort_by,
      color,
      price_min,
      price_max,
      collection,
      // No page parameter and no size filter - fetch all matching products
    });
    allFilteredProductsForSizes = allFilteredWithoutSize;
  }

  // Fetch all products WITHOUT COLOR filter for color availability
  const { products: allFilteredWithoutColor } = await fetchAllProducts({
    sort: sort_by,
    size,
    price_min,
    price_max,
    collection,
  });

  // Fetch all products WITHOUT COLLECTION filter for collection availability
  const { products: allFilteredWithoutCollection } = await fetchAllProducts({
    sort: sort_by,
    size,
    color,
    price_min,
    price_max,
  });

  // Compute available filters based on ALL filtered results (not paginated)
  const availableSizes = getAvailableSizes({
    color,
    productsForAvailableSizes: allFilteredProductsForSizes,
  });

  const availableColors = getAvailableColors({
    size,
    availableProducts: allFilteredWithoutColor,
  });

  const availableCollections = getAvailableCollections({
    availableProducts: allFilteredWithoutCollection,
  });

  // Get expanded products length
  const expandedProducts = expandProducts(products, size, color);
  const variantsCount = expandedProducts.length;
  const productsCount = products.length;
  const allProductsCount = allProductsForFilters.length;

  return (
    <main>
      {/* Banner image */}
      <section className="relative w-full h-[400px]">
        <div className="flex items-center justify-center absolute top-0 left-0 right-0 h-[400px] after:absolute after:-inset-0 after:bg-black/20 after:content-[''] after:z-0">
          <Image
            src="/categories/all.webp"
            alt="Categories"
            className="w-full absolute top-0 left-0 h-full object-cover object-center z-0"
            loading="lazy"
            width={1440}
            height={600}
          />
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white text-center font-light uppercase leading-tight tracking-tight relative z-[1]">
            All Products
          </h1>
        </div>
      </section>
      {/* Categories Bar */}
      <div className="border-b border-border">
        <div className="container">
          <div className="flex items-center justify-center gap-10">
            <span className="sticky left-0 text-sm text-gray-500 uppercase font-semibold tracking-[1px]">
              Shop
            </span>
            <nav className="max-w-full overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-proximity">
              <ul className="grid grid-flow-col gap-10 min-w-max font-barlow pe-10">
                <li className="py-5">
                  <Link
                    href="/categories"
                    className={cn(
                      "relative inline-block after:absolute after:w-full after:left-0 after:h-px after:bottom-0 after:content-[''] after:bg-black after:transition-transform after:duration-200 after:ease-in-out after:scale-x-0 hover:after:scale-x-100 after:origin-right hover:after:origin-left",
                      {
                        "after:scale-x-100 after:origin-left": true,
                      }
                    )}
                  >
                    All
                  </Link>
                </li>
                {categories.map((category) => (
                  <li key={category.documentId} className="py-5">
                    <Link
                      href={`/categories/${category.slug}`}
                      className="relative inline-block after:absolute after:w-full after:left-0 after:h-px after:bottom-0 after:content-[''] after:bg-black after:transition-transform after:duration-200 after:ease-in-out after:scale-x-0 hover:after:scale-x-100 after:origin-right hover:after:origin-left"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
      <section className="container max-w-screen-xl py-10">
        <div className="grid grid-cols-2 mb-5 gap-4">
          <div className="flex items-center gap-10 col-span-1">
            <ProductsFilter
              sizes={allSizes}
              colors={allColors}
              collections={allCollections}
              availableSizes={availableSizes}
              availableColors={availableColors}
              availableCollections={availableCollections}
              resultsCount={variantsCount}
              isStrapCategory={false}
            />
            <div className="hidden md:flex items-center gap-2">
              {productsCount > 0 && hasFilters && (
                <span className="text-sm">{productsCount} Products</span>
              )}
              {!hasFilters && allProductsCount > productsCount && (
                <span className="text-sm">{allProductsCount} Products</span>
              )}
              {variantsCount > productsCount && (
                <span className="text-sm text-gray-500">
                  ({variantsCount} Variants)
                </span>
              )}
            </div>
          </div>
          <div className="col-span-1 flex justify-end md:order-1">
            <ProductSorting />
          </div>
          <div className="flex md:hidden items-center justify-center col-span-2 gap-2">
            {productsCount > 0 && hasFilters && (
              <span className="text-sm">{productsCount} Products</span>
            )}
            {!hasFilters && allProductsCount > productsCount && (
              <span className="text-sm">{allProductsCount} Total</span>
            )}
            {variantsCount > productsCount && (
              <span className="text-sm text-gray-500">
                ({variantsCount} Variants)
              </span>
            )}
          </div>
          {products.length > 0 && (
            <span className="md:hidden text-sm text-center col-span-2">
              {variantsCount} Results
            </span>
          )}
        </div>
        {products.length > 0 ? (
          <ProductList
            products={products}
            selectedSize={size}
            selectedColor={color}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-[250px]">
            <h2 className="text-2xl md:text-3xl text-primary uppercase">
              No products found
            </h2>
            <p className="text-sm text-gray-500">
              Please try a different filter or check back later.
            </p>
          </div>
        )}
      </section>
      {totalPages > 1 && (
        <SmartPagination currentPage={currentPage} totalPages={totalPages} />
      )}
    </main>
  );
}
