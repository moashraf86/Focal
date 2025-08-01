import { fetchBestsellingProducts } from "@/lib/data";
import BestsellingProducts from "../product/BestsellingProducts";

export default async function BestsellingSection() {
  const [menProducts, womenProducts] = await Promise.all([
    fetchBestsellingProducts("men"),
    fetchBestsellingProducts("women"),
  ]);

  const staticProducts = {
    men: menProducts.products,
    women: womenProducts.products,
  };

  return <BestsellingProducts staticProducts={staticProducts} />;
}
