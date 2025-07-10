"use client";
import ProductTitle from "./ProductTitle";
import ProductDescription from "./ProductDescription";
import ProductPrice from "./ProductPrice";
import QuantitySelector from "../shared/QuantitySelector";
import ProductActions from "./ProductActions";
import { Product } from "@/lib/definitions";
import { useEffect, useState } from "react";
import ProductCarousel from "./ProductCarousel";
import ProductRating from "./ProductRating";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import ProductSizeSelector from "./ProductSizeSelector";
import ColorSelector from "./ColorSelector";
import { useRouter, useSearchParams } from "next/navigation";
import BuyWithProducts from "./BuyWithProducts";
import { useProductVisibilityObserver } from "@/hooks/useProductVisibility";

export default function ProductDetails({
  product,
  initialQuantity = 1,
}: {
  product: Product;
  initialQuantity?: number;
}) {
  const searchParams = useSearchParams();
  const URL = useRouter();

  const defaultSize = product.sizes?.[0].value ?? "";
  const selectedSize = searchParams.get("size") || defaultSize;

  const defaultColor = product.sizes?.[0].colors?.[0].name ?? "";
  const selectedColor = searchParams.get("color") || defaultColor;

  const allColors =
    product.sizes?.find((size) => size.value === selectedSize)?.colors || [];

  const carouselImages =
    allColors.find((color) => color.name === selectedColor)?.images ?? [];

  const [resetCarousel, setResetCarousel] = useState(false);

  const [quantity, setQuantity] = useState<number>(initialQuantity);

  const intersectionRef = useProductVisibilityObserver();
  // Handle size change
  const handleSizeChange = (value: string) => {
    URL.push(`?size=${value}&color=${defaultColor}`, { scroll: false });
  };

  // Handle color change
  const handleColorChange = (value: string) => {
    URL.push(`?size=${selectedSize}&color=${value}`, { scroll: false });
  };

  // Update carousel images when selected size or color changes
  useEffect(() => {
    setResetCarousel((prev) => !prev);
  }, [selectedSize, selectedColor]);

  // Set default URL params on first render
  useEffect(() => {
    URL.push(`?size=${selectedSize}&color=${selectedColor}`, { scroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="container max-w-screen-xl" ref={intersectionRef}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 mb-20">
        {/* Product Carousel */}
        <div className="lg:sticky lg:top-20 lg:col-span-7">
          <ProductCarousel
            images={carouselImages}
            className="lg:sticky lg:top-20 lg:col-span-7"
            resetCarousel={resetCarousel}
          />
        </div>
        {/* Product details */}
        <div className="space-y-6 lg:col-span-5">
          <div className="space-y-6 border-b border-border pb-4">
            <ProductTitle title={product.name} />
            <div className="flex items-center gap-1 text-lg lg:text-2xl  font-normal font-barlow">
              <ProductPrice
                price={product.price}
                className="text-lg lg:text-2xl font-barlow font-normal"
              />
              USD
            </div>
            <ProductRating rating={5} reviews={3} />
          </div>
          <ProductSizeSelector
            sizes={product.sizes}
            selectedSize={selectedSize}
            onSizeChange={handleSizeChange}
          />
          <div className="space-y-2">
            <span>Strap: {selectedColor}</span>
            <ColorSelector
              mode="single"
              colors={allColors}
              selectedColors={[selectedColor]}
              onColorSelect={handleColorChange}
            />
          </div>
          <div className="space-y-1">
            <span>Quantity:</span>
            <QuantitySelector
              quantity={quantity}
              setQuantity={setQuantity}
              mode="product"
            />
          </div>
          <ProductActions
            product={product}
            quantity={quantity}
            selectedSize={selectedSize}
            color={selectedColor}
          />
          <Accordion type="single" collapsible>
            <AccordionItem value="description">
              <AccordionTrigger className="text-sm font-barlow uppercase font-semibold tracking-[1px] hover:no-underline">
                Description
              </AccordionTrigger>
              <AccordionContent>
                <ProductDescription description={product.description} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping">
              <AccordionTrigger className="text-sm font-barlow uppercase font-semibold tracking-[1px] hover:no-underline">
                Shipping & Returns
              </AccordionTrigger>
              <AccordionContent className="font-barlow space-y-2">
                <div className="space-y-1">
                  <strong>Worldwide free shipping</strong>
                  <p>
                    We use DHL Express for worldwide shipping. Delivery time is
                    usually 2-4 working days. NB: For Countries outside EU
                    buying items ex. VAT, be aware you have to pay import taxes
                    according to the laws of that specific country. In case of
                    returns we are not able to return any duties or taxes, as
                    this is paid to and handled directly between you (the
                    customer) and your country.
                  </p>
                </div>
                <div className="space-y-1">
                  <strong>Return policy</strong>
                  <p>
                    If you want to change a product into another size, color
                    etc, please contact us so we are able to reserve the new
                    item in our stock immediately. You are always entitled to an
                    exchange or refund within 30 days after you have received
                    your package, as long as the item has not been used. All
                    original packaging, price labels etc. shall be returned with
                    the product without having been tampered with.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {product.buyWith.length > 0 && <BuyWithProducts product={product} />}
        </div>
      </div>
    </section>
  );
}
