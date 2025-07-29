import { cn } from "@/lib/utils";
import { useState } from "react";
import ProductDescription from "./ProductDescription";
import { Product } from "@/lib/definitions";
import FeaturedIcons from "./FeaturedIcons";

const ProductInfoTabs = ({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) => {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: "DESCRIPTION" },
    { id: "shipping", label: "SHIPPING & RETURNS" },
  ];

  return (
    <div className={cn("w-full", className)}>
      {/* Tab Navigation */}
      <div className="relative flex items-center gap-8 after:content-[''] after:absolute after:w-full after:h-px after:bg-gray-200 after:-bottom-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-0 py-3 text-sm font-semibold tracking-[1px] transition-colors font-barlow uppercase hover:no-underline"
            )}
          >
            {tab.label}
          </button>
        ))}
        <span
          className={cn(
            "h-[2px] bg-gray-900 absolute content-[''] left-0 w-full mx-auto -bottom-2 z-10 origin-left transition-transform duration-300",
            activeTab === "description"
              ? "scale-x-[.1413]"
              : "scale-x-[.22645] translate-x-[127px]"
          )}
        />
      </div>

      {/* Tab Content */}
      <div className="text-gray-700 leading-relaxed">
        {activeTab === "description" && (
          <div className="space-y-10 text-sm animate-in fade-in-0 duration-700">
            <ProductDescription description={product.description} />
            {/* Feature Icons */}
            <FeaturedIcons className="hidden lg:flex" />
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="space-y-4 text-sm animate-in fade-in-0 duration-700">
            <div className="space-y-1">
              <strong>Worldwide free shipping</strong>
              <p>
                We use DHL Express for worldwide shipping. Delivery time is
                usually 2-4 working days. NB: For Countries outside EU buying
                items ex. VAT, be aware you have to pay import taxes according
                to the laws of that specific country. In case of returns we are
                not able to return any duties or taxes, as this is paid to and
                handled directly between you (the customer) and your country.
              </p>
            </div>
            <div className="space-y-1">
              <strong>Return policy</strong>
              <p>
                If you want to change a product into another size, color etc,
                please contact us so we are able to reserve the new item in our
                stock immediately. You are always entitled to an exchange or
                refund within 30 days after you have received your package, as
                long as the item has not been used. All original packaging,
                price labels etc. shall be returned with the product without
                having been tampered with.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductInfoTabs;
