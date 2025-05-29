"use client";
import Carousel from "@/components/layout/Carousel";
import Categories from "@/components/layout/Categories";
import BestsellingProducts from "../components/product/BestsellingProducts";
import FeaturedProductsSlider from "@/components/product/FeaturedProductsSlider";
import WhyChooseUs from "@/components/shared/WhyChooseUs";

export default function Home() {
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
