import { StrapiImage } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function CarouselIndicators({
  images,
  current,
  handleScrollToImage,
  indicatorsMaxHeight,
  className,
}: {
  images: StrapiImage[];
  current: number;
  handleScrollToImage: (index: number) => void;
  indicatorsMaxHeight?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "lg:overflow-y-auto lg:min-w-fit scrollbar-hide",
        className
      )}
      style={{
        maxHeight: indicatorsMaxHeight ? `${indicatorsMaxHeight}px` : "none",
      }}
    >
      <div className="grid grid-flow-col sm:auto-cols-[15vw] md:auto-cols-[12vw] gap-2 p-2 lg:flex lg:flex-col snap-x snap-mandatory overflow-x-auto scrollbar-hide lg:overflow-x-visible">
        {images.map((image, index) => (
          <button
            key={image.id}
            className={cn(
              "relative w-full aspect-[9/11] lg:w-16 lg:h-20 xl:w-20 xl:h-24 p-3 after:absolute after:content-[''] after:inset-[-3px] after:bg-transparent after:border-2 after:border-primary after:z-[-1] after:transition-transform after:duration-200 after:ease",
              {
                " after:scale-100 after:opacity-100": current === index,
                "after:scale-90 after:opacity-0": current !== index,
              }
            )}
            onClick={() => handleScrollToImage(index)}
          >
            <Image
              src={images[index].formats?.small?.url || images[index].url}
              alt={images[index].alternativeText || "Indicator image"}
              fill
              quality={100}
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
