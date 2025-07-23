import { StrapiImage } from "@/lib/definitions";
import Image from "next/image";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { useEffect, useRef, useState } from "react";
import CarouselIndicators from "./CarouselIndicators";
import { cn } from "@/lib/utils";
import { useWindowSize } from "@uidotdev/usehooks";
import useFancybox from "@/hooks/useFancybox";
import { ZoomIn } from "lucide-react";
import { Button } from "../ui/button";
import { Fancybox } from "@fancyapps/ui/dist/fancybox";
export default function ProductCarousel({
  images,
  className,
  resetCarousel,
}: {
  images: StrapiImage[];
  className?: string;
  resetCarousel?: boolean;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState<number>(0);
  const imageRef = useRef<HTMLImageElement>(null);
  const [indicatorsMaxHeight, setIndicatorsMaxHeight] = useState<number>(
    imageRef.current?.clientHeight || 0
  );
  const size = useWindowSize();
  const [fancyboxRef] = useFancybox({
    theme: "light",
  });
  // handle carousel scroll to specific image
  const handleScrollToImage = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };
  // Handle zoom in
  const handleZoomIn = () => {
    const galleryImages = images.map((image) => ({
      src: image.url,
      type: "image",
      alt: image.alternativeText || "Product image",
    }));
    Fancybox.show(galleryImages, {
      startIndex: current,
      theme: "light",
      showClass: "f-zoomInUp",
      hideClass: "f-zoomOutDown",
    });
  };

  // Scroll to the next or previous image when clicking on the image
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, right } = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX;
    const isLeftHalf = clickX < left + (right - left) / 2;
    if (isLeftHalf) {
      api?.scrollPrev();
    } else {
      api?.scrollNext();
    }
  };

  // Change mouse pointer to a pointer left or right when hovering over the image
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, right } = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX;
    const isLeftHalf = clickX < left + (right - left) / 2;
    if (isLeftHalf) {
      e.currentTarget.style.cursor = "w-resize";
    } else {
      e.currentTarget.style.cursor = "e-resize";
    }
  };

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

  // Handle window resize
  useEffect(() => {
    if (imageRef.current) {
      const height = imageRef.current.clientHeight;
      setIndicatorsMaxHeight(height);
    }
  }, [size]);

  // Reset the carousel to the first image when the selected color/size changes
  useEffect(() => {
    setCurrent(0);
    api?.scrollTo(0);
  }, [resetCarousel, api]);

  return (
    <Carousel
      opts={{
        duration: 12,
      }}
      className={cn(
        "w-full flex flex-col-reverse lg:flex-row gap-4",
        className
      )}
      setApi={setApi}
    >
      <CarouselIndicators
        current={current}
        images={images}
        handleScrollToImage={handleScrollToImage}
        indicatorsMaxHeight={indicatorsMaxHeight}
        className="hidden md:block"
      />
      <div className="relative w-full">
        <CarouselContent ref={fancyboxRef}>
          {images.map((image, index) => (
            <CarouselItem key={index} ref={imageRef}>
              <div
                className="relative"
                onClick={handleImageClick}
                onMouseMove={handleMouseMove}
              >
                <Image
                  src={image.url}
                  alt={image.alternativeText || "Product image"}
                  height={500}
                  width={500}
                  className="object-cover object-center aspect-auto w-full h-full"
                  quality={100}
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 100vw"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Zoom in button */}
        <Button
          variant="ghost"
          size="icon"
          className="bg-[#FFF] absolute top-4 right-4 hover:bg-[#FFF] z-10"
          onClick={handleZoomIn}
        >
          <ZoomIn onClick={handleZoomIn} />
        </Button>
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center justify-end gap-2 md:hidden h-8 bg-primary/40 rounded-full backdrop-blur-lg text-primary-foreground">
        <CarouselPrevious className="static translate-0 bg-transparent border-0 shadow-none hover:bg-transparent hover:text-primary-foreground" />
        <span>
          {current + 1} / {images.length}
        </span>
        <CarouselNext className="static translate-0 bg-transparent border-0 shadow-none hover:bg-transparent hover:text-primary-foreground" />
      </div>
    </Carousel>
  );
}
