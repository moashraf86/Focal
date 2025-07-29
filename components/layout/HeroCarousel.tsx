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
          href: "/products/1926-at-sea-steel-green-turtle-vintage?size=39mm&color=3-Link",
        },
        {
          text: "Shop The Collection",
          href: "/faces/1926",
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
          href: "/products/1988-moonphase",
        },
      ],
      align: "start",
    },
    {
      title: "Women's Collection",
      slogan: "New In",
      image: "/hero-3.webp",
      links: [
        {
          text: "Shop The Watch",
          href: "/products/1969-petite-rose-gold-blue-sunray?size=32mm&color=Mesh%20Rose%20Gold",
        },
      ],
      align: "start",
    },
  ];

  const [activeIndex, setActiveIndex] = React.useState(0);
  const activeSlide = carouselData[activeIndex];

  const nextSlide = () =>
    setActiveIndex((activeIndex + 1) % carouselData.length);

  const prevSlide = () =>
    setActiveIndex(
      (activeIndex - 1 + carouselData.length) % carouselData.length
    );

  // Handle click on left/right half of carousel
  const handleCarouselClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, right } = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX;
    const isLeftHalf = clickX < left + (right - left) / 2;

    // If clicked on left half, go to previous; if right half, go to next
    if (isLeftHalf) {
      prevSlide();
    } else {
      nextSlide();
    }
  };

  // Handle mouse move to change cursor based on position
  const handleCarouselMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, right } = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX;
    const isLeftHalf = clickX < left + (right - left) / 2;

    // Change cursor based on mouse position
    if (isLeftHalf) {
      e.currentTarget.style.cursor = "w-resize";
    } else {
      e.currentTarget.style.cursor = "e-resize";
    }
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  return (
    <section className="relative h-[calc(100vh-6rem)]">
      <div
        className="absolute inset-0 bg-black/20 z-[1]"
        onClick={handleCarouselClick}
        onMouseMove={handleCarouselMouseMove}
      />

      {/* slide images */}
      {carouselData.map((_, index) => (
        <div key={index} className="absolute inset-0">
          <Image
            src={carouselData[index].image}
            alt={carouselData[index].title}
            className={cn(
              "absolute inset-0 object-cover transition-opacity duration-700 ease-in-out select-none",
              activeIndex === index ? "opacity-100" : "opacity-0"
            )}
            fill
            loading={index === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}

      {/* Slide Content */}
      <div className="container mx-auto h-full max-w-5xl px-4 lg:px-8 relative z-[2] pointer-events-none">
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
            <div className="flex gap-4 flex-wrap pointer-events-auto">
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
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-[3] pointer-events-auto">
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
