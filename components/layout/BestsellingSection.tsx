import { fetchBestsellingProducts } from "@/lib/data";
import { Product } from "@/lib/definitions";
import BestsellingProducts from "../product/BestsellingProducts";

export default async function BestsellingSection() {
  let staticProducts: { men: Product[]; women: Product[] } = {
    men: [],
    women: [],
  };

  try {
    const [menProducts, womenProducts] = await Promise.all([
      fetchBestsellingProducts("men"),
      fetchBestsellingProducts("women"),
    ]);

    staticProducts = {
      men: menProducts.products,
      women: womenProducts.products,
    };
  } catch (error) {
    console.error("BestsellingSection: failed to fetch products", error);
  }

  return <BestsellingProducts staticProducts={staticProducts} />;
}
