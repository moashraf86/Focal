"use client";
import { Award, Globe2, LockKeyhole, Mail } from "lucide-react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";

export default function StoreFeatures() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState<number>(0);
  const autoplayRef = useRef(Autoplay({ delay: 3000 }));

  // handle carousel scroll to specific item
  const handleScrollToItem = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  const features = [
    {
      id: 1,
      icon: <Globe2 className="w-6 h-6" />,
      title: "Free worldwide shipping",
      description:
        "Free worldwide shipping and returns, customs and duties taxes included",
    },
    {
      id: 2,
      icon: <Award className="w-6 h-6" />,
      title: "2 years warranty",
      description:
        "Watches guaranteed during 2 years from the date of purchase.",
    },
    {
      id: 3,
      icon: <LockKeyhole className="w-6 h-6" />,
      title: "24/7 customer support",
      description:
        "24/7 customer support to assist you with any inquiries or issues",
    },
    {
      id: 4,
      icon: <Mail className="w-6 h-6" />,
      title: "contact us",
      description:
        "Need to contact us ? Just send us an e-mail at info@yourstore.com",
    },
  ];

  // Initialize the carousel
  useEffect(() => {
    if (!api) {
      return;
    }
    // Set the current index to the first image
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="p-10 bg-midnight text-white">
      <div className="hidden lg:grid auto-cols-fr grid-flow-col gap-6">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="flex flex-col items-center justify-start gap-4 text-center"
          >
            {feature.icon}
            <h3 className="text-sm font-semibold font-barlow text-inherit leading-relaxed uppercase tracking-[1px]">
              {feature.title}
            </h3>
            <p className="text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
      <Carousel
        className="lg:hidden"
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[autoplayRef.current]}
        onMouseEnter={() => autoplayRef.current.stop()}
        onMouseLeave={() => autoplayRef.current.play()}
      >
        <CarouselContent className="flex gap-6">
          {features.map((feature) => (
            <CarouselItem key={feature.id}>
              <div
                key={feature.id}
                className="flex flex-col items-center justify-start gap-4 text-center"
              >
                {feature.icon}
                <h3 className="text-sm font-semibold font-barlow text-inherit leading-relaxed uppercase tracking-[1px]">
                  {feature.title}
                </h3>
                <p className="text-sm">{feature.description}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Indicators */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: features.length }, (_, index) => (
            <button
              key={index}
              className={cn("w-2 h-2 bg-white/50 hover:bg-white", {
                "bg-white": current === index,
              })}
              onClick={() => handleScrollToItem(index)}
            ></button>
          ))}
        </div>
      </Carousel>
    </section>
  );
}
