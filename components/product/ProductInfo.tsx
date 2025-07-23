"use client";

import { Product } from "@/lib/definitions";
import BuyWithProducts from "./BuyWithProducts";
import ProductInfoTabs from "./ProductInfoTabs";
import ProductInfoAccordion from "./ProductInfoAccordion";
import FeaturedIcons from "./FeaturedIcons";

export const ProductInfo = ({ product }: { product: Product }) => {
  return (
    <div className="container max-w-screen-xl mb-12 lg:mb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        {/* Left Column - Product Info Tabs */}
        <div className="lg:col-span-7 order-1 lg:order-0">
          <ProductInfoTabs product={product} className="hidden lg:block" />
          <ProductInfoAccordion product={product} className="lg:hidden" />
          <FeaturedIcons className="lg:hidden" />
        </div>

        {/* Right Column - Buy With Section */}
        {product.buyWith.length > 0 && (
          <div className="lg:col-span-5 order-0 lg:order-1">
            <BuyWithProducts product={product} />
          </div>
        )}
      </div>
    </div>
  );
};
