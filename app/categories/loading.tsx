import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

const categories = [
  {
    name: "All",
    slug: "all",
  },
  {
    name: "Men",
    slug: "men",
  },
  {
    name: "Women",
    slug: "women",
  },
  {
    name: "Straps & Bands",
    slug: "straps-bands",
  },
  {
    name: "Gifts & Pouches",
    slug: "gifts-pouches",
  },
  {
    name: "Limited Edition",
    slug: "limited-edition",
  },
];

export default async function Loading() {
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

      {/* Navigation Skeleton */}
      <div className="border-b border-border">
        <div className="container">
          <div className="flex items-center justify-center gap-10">
            <span className="sticky left-0 text-sm text-gray-500 uppercase font-semibold tracking-[1px]">
              Shop
            </span>
            <nav className="max-w-full overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-proximity">
              <ul className="grid grid-flow-col gap-10 min-w-max font-barlow pe-10">
                {categories.map((category) => (
                  <li key={category.slug} className="py-5">
                    {category.name}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Filter & Sorting Skeleton */}
      <section className="container max-w-screen-xl py-10">
        <div className="grid grid-cols-2 mb-5 gap-4">
          <div className="flex items-center gap-10 col-span-1">
            {/* Show Filters */}
            <Skeleton className="h-6 w-24" />
            {/* Results Count */}
            <Skeleton className="hidden md:block h-6 w-24" />
          </div>
          <div className="col-span-1 flex justify-end md:order-1">
            <div className="flex items-center gap-1">
              {/* Sort By */}
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
          {/* Results Count */}
          <div className="col-span-2 md:hidden flex justify-center">
            <Skeleton className="h-6 w-24" />
          </div>
        </div>

        {/* Product List Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-4 w-3/5 mx-auto" />
              <Skeleton className="h-4 w-1/3 mx-auto" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
