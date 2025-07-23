import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/lib/definitions";

export default function BuyWithProducts({ product }: { product: Product }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-barlow uppercase font-semibold tracking-[1px] hover:no-underline">
        Buy with
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4">
        {product.buyWith.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
