// categories/[slug]/page.tsx
import type { Metadata } from "next";
import {
  fetchCategories,
  fetchProductsByCategory,
  fetchProductsByCategoryBase,
} from "@/lib/data";
import ProductList from "../../../components/product/ProductList";
import Link from "next/link";
import Image from "next/image";
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
import ProductSorting from "@/components/product/ProductSorting";
import ProductsFilter from "@/components/product/ProductsFilter";
import { cache } from "react";
import { Product } from "@/lib/definitions";

// Cache data fetching functions
const getCachedCategories = cache(fetchCategories);
const getCachedProductsByCategoryBase = cache(fetchProductsByCategoryBase);

// Precompute filter options
const computeFilterOptions = (products: Product[]) => {
  const allSizesData = products.flatMap((product) => product.sizes);
  const allColorsData = allSizesData.flatMap((size) => size.colors);
  const allCollectionsData = products.flatMap((product) => product.collections);

  return {
    allSizes: getAllSizes({ allSizesData }),
    allColors: getAllColors({ allColorsData }),
    allCollections: getAllCollections({ allCollectionsData }),
  };
};

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Generate dynamic metadata for the category page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Extract slug from params and format it for the title
  const { slug } = await params;
  const slugWithoutHyphens = slug.replace(/-/g, " ");
  const capitalizedSlug = slugWithoutHyphens
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${capitalizedSlug}`,
    description: `Explore our ${capitalizedSlug} collection. Find the perfect product that suits your style and needs.`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { sort_by, size, color, price_min, price_max, collection } =
    await searchParams;

  // Fetch base data (heavily cached)
  const [{ categories }, { products: allProducts }] = await Promise.all([
    getCachedCategories(),
    getCachedProductsByCategoryBase(slug),
  ]);

  // Precompute filter options from base products
  const { allSizes, allColors, allCollections } =
    computeFilterOptions(allProducts);

  // Check if any filters are applied
  const hasFilters = Boolean(
    size ||
      color ||
      price_min ||
      price_max ||
      collection ||
      (sort_by && sort_by !== "createdAt:desc")
  );

  // Fetch filtered products only when needed
  let products = allProducts;
  if (hasFilters) {
    const { products: filtered } = await fetchProductsByCategory({
      slug,
      sort: sort_by,
      size,
      color,
      price_min,
      price_max,
      collection,
    });
    products = filtered;
  }

  // Get current category
  const category = categories.find((category) => category.slug === slug);
  const catBanner = category?.banner || {
    url: "/categories/all.webp",
    alternativeText: "Category Banner",
  };

  // Compute available filters based on current results
  const availableSizes = getAvailableSizes({
    color,
    productsForAvailableSizes: products,
  });

  const availableColors = getAvailableColors({
    size,
    availableProducts: products,
  });

  const availableCollections = getAvailableCollections({
    availableProducts: products,
  });

  // Get expanded products based on selected size and color
  const expandedProducts = expandProducts(products, size, color);
  const resultsCount = expandedProducts.length;

  return (
    <main>
      {/* Banner image */}
      <section className="relative w-full h-[400px]">
        <div className="flex items-center justify-center absolute top-0 left-0 right-0 h-[400px] after:absolute after:-inset-0 after:bg-black/20 after:content-[''] after:z-0">
          <Image
            src={catBanner.url}
            alt={catBanner.alternativeText}
            className="w-full absolute top-0 left-0 h-full object-cover object-center z-0"
            loading="lazy"
            width={1440}
            height={600}
          />
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white text-center font-light uppercase leading-tight tracking-tight relative z-[1]">
            {`${category?.name}'s Watches`}
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
                        "after:scale-x-100 after:origin-left": slug === "all",
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
                      className={cn(
                        "relative inline-block after:absolute after:w-full after:left-0 after:h-px after:bottom-0 after:content-[''] after:bg-black after:transition-transform after:duration-200 after:ease-in-out after:scale-x-0 hover:after:scale-x-100 after:origin-right hover:after:origin-left",
                        {
                          "after:scale-x-100 after:origin-left":
                            slug === category.slug,
                        }
                      )}
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
              resultsCount={resultsCount}
            />
            {products.length > 0 && (
              <span className="hidden md:inline-block text-sm ">
                {resultsCount} Results
              </span>
            )}
          </div>
          <div className="col-span-1 flex justify-end md:order-1">
            <ProductSorting />
          </div>
          {products.length > 0 && (
            <span className="md:hidden text-sm text-center col-span-2">
              {resultsCount} Results
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
    </main>
  );
}
