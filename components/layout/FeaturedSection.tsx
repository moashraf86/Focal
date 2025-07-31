import { fetchFeaturedProducts } from "@/lib/data";
import FeaturedProductsSlider from "../product/FeaturedProductsSlider";

export async function FeaturedSection() {
  const featuredProducts = await fetchFeaturedProducts();

  const staticProducts = {
    products: featuredProducts.products,
  };

  return <FeaturedProductsSlider staticProducts={staticProducts} />;
}
