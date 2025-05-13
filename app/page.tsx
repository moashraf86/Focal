import Carousel from "@/components/layout/Carousel";
import Categories from "@/components/layout/Categories";
import BestsellingProducts from "../components/product/BestsellingProducts";

export default function Home() {
  return (
    <main>
      <Carousel />
      <Categories />
      <BestsellingProducts />
    </main>
  );
}
