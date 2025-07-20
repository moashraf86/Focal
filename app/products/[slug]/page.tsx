import { fetchProductBySlug } from "@/lib/data";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ProductDetails from "@/components/product/ProductDetails";
import RelatedProducts from "@/components/product/RelatedProducts";
import ProductBanner from "@/components/product/ProductBanner";
import FAQ from "@/components/shared/FAQ";
import StickyProductSummary from "@/components/product/StickyProductSummry";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
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

export default async function Product({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Fetch product by Slug
  const { product } = await fetchProductBySlug(slug);

  // Get Categories slugs
  const categoriesSlugs = product.categories.map((category) => category.slug);

  return (
    <main>
      <Breadcrumb className="container max-w-screen-xl">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <ProductDetails product={product} />
      <StickyProductSummary product={product} />
      <ProductBanner product={product} />
      <RelatedProducts
        categories={categoriesSlugs}
        face={product.faces[0]?.slug}
        product={product}
      />
      <FAQ />
    </main>
  );
}
