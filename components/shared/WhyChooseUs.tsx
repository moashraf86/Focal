import Image from "next/image";
import { useRef, useState } from "react";

export default function WhyChooseUs() {
  // detect scroll-x distance of grid to move scrollbar based on scroll-x
  const gridRef = useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [scrollPercentage, setScrollPercentage] = useState(0);

  // Set the scroll width and scroll x distance
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    setScrollWidth(e.currentTarget.scrollWidth);
    const scrollPercentage =
      (scrollLeft / (scrollWidth - e.currentTarget.clientWidth)) * 100;
    setScrollPercentage(scrollPercentage);
  };

  return (
    <section>
      <div className="relative container py-9 md:py-12 mb-10">
        <div className="space-y-4 max-w-lg mx-auto text-center mb-9 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-jost font-light text-center uppercase tracking-tight">
            Get the perfect watches
          </h2>
          <p className="text-sm font-light text-pretty text-primary">
            In your endeavors to get the perfect men’s watch, the best place to
            visit is About Vintage. Not only do they offer the highest quality
            watches but also excellent services. When you place your order, you
            can receive your watch worldwide. Additionally, you will enjoy 30
            days free return internationally. There is a huge collection to
            choose from including men’s classic watches, sports watches, vintage
            watches, and others. They are all hand-picked by our personnel with
            a good eye for quality and style to complement the look you are
            going for.
          </p>
        </div>
        <div className="space-y-9 md:space-y-12 text-center">
          <h3 className="text-xs font-semibold font-barlow tracking-[1px] uppercase">
            Cutting-edge watches
          </h3>
          <div
            className="grid auto-cols-[100vw] sm:auto-cols-[50vw] md:auto-cols-[40vw] lg:auto-cols-[25vw] grid-cols-none grid-flow-col gap-5 lg:gap-10 overflow-x-auto snap-x snap-mandatory scrollbar-hide hover:cursor-all-scroll"
            onScroll={handleScroll}
            ref={gridRef}
          >
            <figure className="space-y-4">
              <Image
                src="https://res.cloudinary.com/daswys0i8/image/upload/v1747927160/150570269_464565051574396_7083552002018217712_n_1000x_jyk2kl.webp"
                alt="Straps"
                width={500}
                height={500}
                className="w-full h-auto object-cover"
              />
              <figcaption>
                <p className="text-sm text-start">
                  <strong>Straps</strong>
                  <br />
                  Switching out your strap is a fast and easy way to give your
                  watch a personal makeover.
                </p>
              </figcaption>
            </figure>
            <figure className="space-y-4">
              <Image
                src="https://res.cloudinary.com/daswys0i8/image/upload/v1747927160/150570269_464565051574396_7083552002018217712_n_1000x_jyk2kl.webp"
                alt="Straps"
                width={500}
                height={500}
                className="w-full h-auto object-cover"
              />
              <figcaption>
                <p className="text-sm text-start">
                  <strong>Straps</strong>
                  <br />
                  Switching out your strap is a fast and easy way to give your
                  watch a personal makeover.
                </p>
              </figcaption>
            </figure>
            <figure className="space-y-4">
              <Image
                src="https://res.cloudinary.com/daswys0i8/image/upload/v1747927160/150570269_464565051574396_7083552002018217712_n_1000x_jyk2kl.webp"
                alt="Straps"
                width={500}
                height={500}
                className="w-full h-auto object-cover"
              />
              <figcaption>
                <p className="text-sm text-start">
                  <strong>Straps</strong>
                  <br />
                  Switching out your strap is a fast and easy way to give your
                  watch a personal makeover.
                </p>
              </figcaption>
            </figure>
            <figure className="space-y-4">
              <Image
                src="https://res.cloudinary.com/daswys0i8/image/upload/v1747927160/150570269_464565051574396_7083552002018217712_n_1000x_jyk2kl.webp"
                alt="Straps"
                width={500}
                height={500}
                className="w-full h-auto object-cover"
              />
              <figcaption>
                <p className="text-sm text-start">
                  <strong>Straps</strong>
                  <br />
                  Switching out your strap is a fast and easy way to give your
                  watch a personal makeover.
                </p>
              </figcaption>
            </figure>
          </div>
        </div>
        {/* Custom scrollbar */}
        <div className="absolute bottom-0 left-5 right-5 lg:left-10 lg:right-10 h-0.5 bg-gray-200 flex items-center">
          <div
            className="h-0.5 bg-primary w-1/4 min-w-8 transition-[width] duration-75 ease-linear"
            style={{
              width: `${scrollPercentage}%`,
            }}
          ></div>
        </div>
      </div>
    </section>
  );
}
