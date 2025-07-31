import Carousel from "@/components/layout/HeroCarousel";
import Categories from "@/components/layout/Categories";
import WhyChooseUs from "@/components/shared/WhyChooseUs";
import BestsellingSection from "@/components/layout/BestsellingSection";
import { FeaturedSection } from "@/components/layout/FeaturedSection";

export default function Home() {
  return (
    <main>
      <Carousel />
      <Categories />
      <BestsellingSection />
      <FeaturedSection />
      <WhyChooseUs />
    </main>
  );
}
