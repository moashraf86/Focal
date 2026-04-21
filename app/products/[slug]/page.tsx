import { fetchAllProductSlugs, fetchProductBySlug } from "@/lib/data";

export const revalidate = 3600;
export const dynamicParams = true;
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ProductDetails from "@/components/product/ProductDetails";
import ProductBanner from "@/components/product/ProductBanner";
import FAQ from "@/components/shared/FAQ";
import StickyProductSummary from "@/components/product/StickyProductSummry";
import { ProductInfo } from "@/components/product/ProductInfo";
import LazyRelatedProducts from "@/components/product/LazyRelatedProducts";
import ScrollToTop from "@/components/product/ScrollToTop";

export async function generateStaticParams() {
  const slugs = await fetchAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

// fetch product data
async function getProductData(slug: string) {
  const { product } = await fetchProductBySlug(slug);
  return product;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductData(slug);
  const imageURL = product.images[0].url;
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
      images: [{ url: imageURL }],
    },
  };
}

export default async function Product({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductData(slug);

  // Get Categories slugs
  const categoriesSlugs = product.categories.map((category) => category.slug);

  return (
    <main>
      <ScrollToTop />
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
      <ProductInfo product={product} />
      <StickyProductSummary product={product} />
      <ProductBanner product={product} />
      {/* Related Products */}
      <LazyRelatedProducts
        categories={categoriesSlugs}
        face={product.faces[0]?.slug}
        product={product}
      />
      <FAQ />
    </main>
  );
}
