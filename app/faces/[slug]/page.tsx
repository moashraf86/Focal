import type { Metadata } from "next";
import {
  fetchFaces,
  fetchProductsByFace,
  fetchProductsByFaceBase,
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
import { notFound } from "next/navigation";
import { cache } from "react";
import { Product } from "@/lib/definitions";
import SmartPagination from "@/components/ui/smartPagination";

// Cache data fetching functions
const getCachedFaces = cache(fetchFaces);
const getCachedProductsByFaceBase = cache(fetchProductsByFaceBase);

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

// Generate dynamic metadata for the face page
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
    openGraph: {
      type: "website",
      title: `${capitalizedSlug}`,
      description: `Explore our ${capitalizedSlug} collection. Find the perfect product that suits your style and needs.`,
      images: [{ url: `opengraph/opengraph-${slug}.jpg` }],
    },
  };
}

export default async function FacePage({ params, searchParams }: Props) {
  const { slug } = await params;
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

  // Fetch base data (heavily cached)
  const [{ faces }, { products: allProducts, pagination }] = await Promise.all([
    getCachedFaces(),
    getCachedProductsByFaceBase(slug, currentPage),
  ]);

  // Get current Face
  const face = faces.find((face) => face.slug === slug);

  // If no matching face is found, render a 404 page
  if (!face) {
    notFound();
  }

  // Fetch ALL products for this face (without any filters) for filter calculations
  // This ensures filters show all available options across the entire face dataset
  const { products: allFaceProductsForFilters } = await fetchProductsByFace({
    slug,
    sort: "createdAt:desc", // Use default sort for consistency
    // No filters applied - fetch all products for this face
  });

  // Precompute filter options from ALL face products (not just base/cached results)
  const { allSizes, allColors, allCollections } = computeFilterOptions(
    allFaceProductsForFilters
  );

  // Calculate pagination
  let totalPages = Math.ceil(pagination.total / 9); // Use 9 items per page

  // Fetch filtered products only when needed
  let products = allProducts;
  let allFilteredProducts = allFaceProductsForFilters;
  let allFilteredProductsForSizes = allFaceProductsForFilters;

  if (hasFilters) {
    const { products: filtered, pagination: filteredPagination } =
      await fetchProductsByFace({
        slug,
        sort: sort_by,
        size,
        color,
        price_min,
        price_max,
        collection,
        page: currentPage,
      });
    products = filtered;
    totalPages = Math.ceil(filteredPagination.total / 9); // Use 9 items per page

    // Fetch ALL filtered products (no pagination) for available filters calculation
    const { products: allFilteredNoPage } = await fetchProductsByFace({
      slug,
      sort: sort_by,
      size,
      color,
      price_min,
      price_max,
      collection,
      // No pagination - fetch all filtered products
    });
    allFilteredProducts = allFilteredNoPage;

    // Fetch ALL products WITHOUT Size filter for size availability
    const { products: allFilteredWithoutSize } = await fetchProductsByFace({
      slug,
      sort: sort_by,
      color,
      price_min,
      price_max,
      collection,
      // No size filter and no pagination - fetch all matching products
    });
    allFilteredProductsForSizes = allFilteredWithoutSize;
  }

  // Get face banner and description
  const faceBanner = face.banner || {
    url: "/categories/all.webp",
    alternativeText: "Face Banner",
  };
  const faceDescription = face.description[0]?.children[0]?.text;

  // Compute available filters based on ALL filtered results (not paginated)
  const availableSizes = getAvailableSizes({
    color,
    productsForAvailableSizes: allFilteredProductsForSizes,
  });

  const availableColors = getAvailableColors({
    size,
    availableProducts: allFilteredProducts,
  });

  const availableCollections = getAvailableCollections({
    availableProducts: allFilteredProducts,
  });

  // Get expanded products based on selected size and color
  const expandedProducts = expandProducts(products, size, color);
  const variantsCount = expandedProducts.length;
  const productsCount = products.length;

  // Determine if this is a strap face (adapt as needed for face logic)
  const isStrapCategory = face?.slug.includes("strap") || false;

  return (
    <main>
      {/* Banner image */}
      <section className="relative w-full h-[400px]">
        <div className="flex items-center justify-center absolute top-0 left-0 right-0 h-[400px] after:absolute after:-inset-0 after:bg-black/20 after:content-[''] after:z-0">
          <div>
            <Image
              src={faceBanner.url}
              alt={faceBanner.alternativeText || "Face Banner"}
              className="w-full absolute top-0 left-0 h-full object-cover object-center z-0"
              loading="lazy"
              width={1440}
              height={600}
            />
          </div>
          <div className="max-w-2xl space-y-4 relative z-[1] text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-white text-center font-light uppercase leading-tight tracking-tight">
              {face?.name}
            </h1>
            <p className="text-sm text-white">{faceDescription}</p>
          </div>
        </div>
      </section>
      {/* Faces Bar */}
      <div className="border-b border-border">
        <div className="container">
          <div className="flex items-center justify-center gap-10">
            <span className="sticky left-0 text-sm text-gray-500 uppercase font-semibold tracking-[1px]">
              Shop by face
            </span>
            <nav className="max-w-full overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-proximity">
              <ul className="grid grid-flow-col gap-10 min-w-max font-barlow pe-10">
                {faces.map((face) => (
                  <li key={face.documentId} className="py-5">
                    <Link
                      prefetch={true}
                      href={`/faces/${face.slug}`}
                      className={cn(
                        "relative inline-block after:absolute after:w-full after:left-0 after:h-px after:bottom-0 after:content-[''] after:bg-black after:transition-transform after:duration-200 after:ease-in-out after:scale-x-0 hover:after:scale-x-100 after:origin-right hover:after:origin-left",
                        {
                          "after:scale-x-100 after:origin-left":
                            slug === face.slug,
                        }
                      )}
                    >
                      {face.name}
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
              isStrapCategory={isStrapCategory}
            />
            <div className="hidden md:flex items-center gap-2">
              {products.length > 0 && (
                <span className="text-sm">{productsCount} Products</span>
              )}
              {variantsCount > productsCount && (
                <span className="text-sm text-gray-500">
                  ({variantsCount} variants)
                </span>
              )}
            </div>
          </div>
          <div className="col-span-1 flex justify-end md:order-1">
            <ProductSorting />
          </div>
          <div className="flex md:hidden items-center justify-center col-span-2 gap-2">
            {products.length > 0 && (
              <span className="text-sm">{productsCount} Products</span>
            )}
            {variantsCount > productsCount && (
              <span className="text-sm text-gray-500">
                ({variantsCount} variants)
              </span>
            )}
          </div>
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
