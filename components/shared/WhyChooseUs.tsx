import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { useIntersectionObserver } from "@uidotdev/usehooks";

export default function WhyChooseUs() {
  const WhyChooseUs = [
    {
      id: 1,
      title: "Straps",
      description:
        "Switching out your strap is a fast and easy way to give your watch a personal makeover.",
      image:
        "https://res.cloudinary.com/daswys0i8/image/upload/v1747927160/150570269_464565051574396_7083552002018217712_n_1000x_jyk2kl.webp",
    },
    {
      id: 2,
      title: "Materials",
      description:
        "We chose to use a super domed sapphire crystal, a flat bezel and an undercut dial with a luminescent filling for the 1926.",
      image:
        "https://res.cloudinary.com/daswys0i8/image/upload/v1748079184/118456764_162078678868212_6502903075854884077_n_1080x_dyb8ze.webp",
    },
    {
      id: 3,
      title: "Swiss Made",
      description:
        "Historical and memorable moments in Swiss horology is not only a chapter, but a whole book of its own.",
      image:
        "https://res.cloudinary.com/daswys0i8/image/upload/v1748079265/118398347_235568284440214_2957685996929562109_n_1080x_qzvi2d.webp",
    },
    {
      id: 4,
      title: "History",
      description:
        "When we launched the Green Turtle, we never thought it would become one of the most iconic models.",
      image:
        "https://res.cloudinary.com/daswys0i8/image/upload/v1748079361/118510182_184719909693049_3950583242858546453_n_1080x_dsmlaf.webp",
    },
  ];

  const gridRef = useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [scrollPercentage, setScrollPercentage] = useState(0);

  const [sectionRef, entry] = useIntersectionObserver({
    threshold: 0.2,
    root: null,
    rootMargin: "0px",
  });

  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    if (entry?.isIntersecting && !hasBeenVisible) {
      setHasBeenVisible(true);
    }
  }, [entry, hasBeenVisible]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    setScrollWidth(e.currentTarget.scrollWidth);
    const scrollPercentage =
      (scrollLeft / (scrollWidth - e.currentTarget.clientWidth)) * 100;
    setScrollPercentage(scrollPercentage);
  };

  return (
    <section ref={sectionRef}>
      <div className="relative container py-9 md:py-12 mb-10">
        <div className="space-y-6  max-w-xl lg:max-w-2xl mx-auto text-center mb-9 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-jost font-light text-center uppercase tracking-tight">
            Get the perfect watches
          </h2>
          <p className="text-sm lg:text-base font-light text-pretty text-primary">
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
            {WhyChooseUs.map((item) => (
              <figure
                className="space-y-4 snap-center snap-always"
                key={item.id}
              >
                {hasBeenVisible && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={500}
                    height={500}
                    className="w-full h-auto object-cover"
                  />
                )}
                <figcaption>
                  <p className="text-sm text-start">
                    <strong>{item.title}</strong>
                    <br />
                    {item.description}
                  </p>
                </figcaption>
              </figure>
            ))}
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
