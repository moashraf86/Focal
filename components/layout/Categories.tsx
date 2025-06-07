import { useIntersectionObserver } from "@uidotdev/usehooks";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const categories = [
  {
    name: "Men",
    slug: "men",
    image: "/categories/men.webp",
    href: "/categories/men",
  },
  {
    name: "Women",
    slug: "women",
    image: "/categories/women.webp",
    href: "/categories/women",
  },
  {
    name: "Straps & Bands",
    slug: "straps",
    image: "/categories/straps.webp",
    href: "/categories/straps-bands",
  },
  {
    name: "Gift & Pouches",
    slug: "gifts",
    image: "/categories/gifts.jpg",
    href: "/categories/gifts-pouches",
  },
];

export default function Categories() {
  const [ref, entry] = useIntersectionObserver({
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

  return (
    <section className="py-12 px-5 lg:px-10" ref={ref}>
      <div className="grid auto-cols-[80vw] sm:auto-cols-[60vw] md:auto-cols-[40vw] grid-cols-none grid-flow-col lg:grid-cols-4 gap-5 lg:gap-10 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={category.href}
            className="group relative overflow-hidden snap-center snap-always h-[50vh] min-w-[80vw] sm:min-w-[60vw] md:min-w-[40vw] lg:min-w-0"
          >
            {hasBeenVisible && (
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 80vw, (max-width: 768px) 60vw, (max-width: 1024px) 40vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            )}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-2xl font-light uppercase text-white">
                {category.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
