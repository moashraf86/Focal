import { fetchFeaturedProducts } from "@/lib/data";
import { Product } from "@/lib/definitions";
import FeaturedProductsSlider from "../product/FeaturedProductsSlider";

export async function FeaturedSection() {
  let staticProducts: { products: Product[] } = { products: [] };

  try {
    const featuredProducts = await fetchFeaturedProducts();
    staticProducts = { products: featuredProducts.products };
  } catch (error) {
    console.error("FeaturedSection: failed to fetch products", error);
  }

  return <FeaturedProductsSlider staticProducts={staticProducts} />;
}
