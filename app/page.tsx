import Carousel from "@/components/layout/HeroCarousel";
import Categories from "@/components/layout/Categories";
import BestsellingProducts from "../components/product/BestsellingProducts";
import FeaturedProductsSlider from "@/components/product/FeaturedProductsSlider";
import WhyChooseUs from "@/components/shared/WhyChooseUs";

export default async function Home() {
  return (
    <main>
      <Carousel />
      <Categories />
      <BestsellingProducts />
      <FeaturedProductsSlider />
      <WhyChooseUs />
    </main>
  );
}
