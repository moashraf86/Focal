"use client";

import { useEffect, useState } from "react";
import Carousel from "@/components/layout/HeroCarousel";
import Categories from "@/components/layout/Categories";
import BestsellingProducts from "../components/product/BestsellingProducts";
import FeaturedProductsSlider from "@/components/product/FeaturedProductsSlider";
import WhyChooseUs from "@/components/shared/WhyChooseUs";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisitedHome");

    if (!hasVisited) {
      setShowLoader(true);
      sessionStorage.setItem("hasVisitedHome", "true");

      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 1000); // preloader duration

      return () => clearTimeout(timer);
    }
  }, []);

  if (showLoader) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="relative flex flex-col items-center justify-center gap-4">
          <Loader2 className="size-10 animate-spin text-primary" />
          <p className="text-lg text-center text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
