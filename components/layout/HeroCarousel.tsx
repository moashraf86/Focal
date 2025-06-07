"use client";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function HeroCarousel() {
  // carousel data
  const carouselData = [
    {
      title: "The First Waterproof Wristwatch",
      slogan: "1926 At'Sea",
      image: "/hero-2.webp",
      links: [
        {
          text: "Shop The Watch",
          href: "/shop",
        },
        {
          text: "Learn More",
          href: "/about",
        },
      ],
      align: "start",
    },
    {
      title: "Limited Edition Frederique Constant",
      slogan: "1988 Moonphase",
      image: "/hero-1.webp",
      links: [
        {
          text: "Shop The Watch",
          href: "/shop",
        },
      ],
      align: "start",
    },
    {
      title: "Women's Collection",
      slogan: "1988 Moonphase",
      image: "/hero-3.webp",
      links: [
        {
          text: "Shop The Watch",
          href: "/shop",
        },
      ],
      align: "start",
    },
  ];

  const [activeIndex, setActiveIndex] = React.useState(0);
  const activeSlide = carouselData[activeIndex];
  const nextSlide = () =>
    setActiveIndex((activeIndex + 1) % carouselData.length);

  React.useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  return (
    <section className="relative h-[calc(100vh-6rem)]">
      <div className="absolute inset-0 bg-black/20 z-[1]"></div>
      {/* slide images */}
      {carouselData.map((_, index) => (
        <div key={index} className="absolute inset-0">
          <Image
            src={carouselData[index].image}
            alt={carouselData[index].title}
            className={cn(
              "absolute inset-0 object-cover transition-opacity duration-700 ease-in-out",
              activeIndex === index ? "opacity-100" : "opacity-0"
            )}
            fill
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}
      {/* Slide Content */}
      <div className="container mx-auto h-full max-w-5xl px-4 lg:px-8 relative z-[2]">
        <div
          className={cn(
            "flex items-center h-full",
            activeSlide.align === "center" ? "justify-center" : "justify-start"
          )}
        >
          <div
            className={cn(
              "flex flex-col gap-8",
              activeSlide.align === "center"
                ? "items-center text-center"
                : "items-start text-start"
            )}
          >
            <span className="text-sm font-semibold text-primary-foreground">
              {activeSlide.slogan}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light uppercase text-primary-foreground max-w-[20ch]">
              {activeSlide.title}
            </h1>
            <div className="flex gap-4 flex-wrap">
              {activeSlide.links.map((link, index) => (
                <Button
                  key={activeIndex + link.text + index}
                  size="lg"
                  asChild
                  className="animate-in fade-in duration-200 ease-in-out"
                >
                  <Link href={link.href}>{link.text}</Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-[2]">
        {carouselData.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "relative w-16 h-0.5 rounded-full bg-primary-foreground/50 overflow-hidden",
              activeIndex === index && "bg-primary-foreground/50"
            )}
          >
            {activeIndex === index && (
              <span className="absolute inset-0 bg-primary-foreground animate-progress" />
            )}
            <span className="sr-only">Slide {index + 1}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
