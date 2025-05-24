"use client";
import Carousel from "@/components/layout/Carousel";
import Categories from "@/components/layout/Categories";
import BestsellingProducts from "../components/product/BestsellingProducts";
import FeaturedProductsSlider from "@/components/product/FeaturedProductsSlider";
import QuickViewDrawer from "@/components/shared/QuickViewDrawer";
import { useQuickView } from "@/hooks/useQuickView";
import WhyChooseUs from "@/components/shared/WhyChooseUs";

export default function Home() {
  const { isOpen, openQuickView, closeQuickView, product } = useQuickView();
  return (
    <main>
      <Carousel />
      <Categories />
      <BestsellingProducts />
      <FeaturedProductsSlider onQuickView={openQuickView} />
      <QuickViewDrawer
        isOpen={isOpen}
        setIsOpen={closeQuickView}
        product={product}
      />
      <WhyChooseUs />
    </main>
  );
}
