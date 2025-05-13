import ProductCard from "@/components/product/ProductCard";
import { fetchRelatedProducts } from "@/lib/data";
import { Product } from "@/lib/definitions";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

export default async function RelatedProducts({
  product,
}: {
  product: Product;
}) {
  // Guard clause: product must have at least one category
  if (!product.categories || product.categories.length === 0) return null;

  let relatedProducts;

  try {
    relatedProducts = await fetchRelatedProducts(
      product.categories[0].slug,
      product.faces ? product.faces[0]?.slug : undefined
    );
  } catch (error) {
    console.error("Failed to fetch related products:", error);
    return null;
  }

  // Filter out the current product
  const filteredProducts = relatedProducts.products.filter(
    (p) => p.id !== product.id
  );

  // If no other related products found
  if (filteredProducts.length === 0) return null;

  return (
    <section className="container max-w-screen-xl mb-20 space-y-10">
      <h2
        className="text-3xl md:text-4xl lg:text-5xl text-center font-light uppercase leading-tight tracking-tight"
        aria-label={`More products like ${product.name}`}
      >
        Available styles
      </h2>
      {/* Visible on screens < 1024px */}
      <div className="grid auto-cols-[52vw] md:auto-cols-[35vw] grid-cols-none grid-flow-col gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide lg:hidden">
        {filteredProducts.map((product) => (
          <div key={product.id} className="snap-center snap-always">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      {/* Visible on screens > 1024px */}
      <Carousel
        className="w-full hidden lg:flex"
        opts={{ align: "start", slidesToScroll: 4 }}
      >
        <CarouselContent className="-ml-6">
          {Array.from({ length: filteredProducts.length }).map((_, index) => (
            <CarouselItem
              key={index}
              className="pl-6 md:basis-1/2 lg:basis-1/4"
            >
              <ProductCard
                product={filteredProducts[index % filteredProducts.length]}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="w-14 h-14 rounded-none -left-7 top-[calc(50%-25px)] shadow-none disabled:hidden" />
        <CarouselNext className="w-14 h-14 rounded-none -right-7 top-[calc(50%-25px)] shadow-none disabled:hidden" />
      </Carousel>
    </section>
  );
}
