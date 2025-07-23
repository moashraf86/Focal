import { OrderItem as OrderItemType } from "@/lib/definitions";
import Image from "next/image";
import ProductPrice from "../product/ProductPrice";
import { Button } from "../ui/button";
import Link from "next/link";

export default function OrderItem({ item }: { item: OrderItemType }) {
  // Find the selected image based on size and color
  const selectedImage =
    item.product?.sizes
      ?.find((size) => size.value === item.size)
      ?.colors?.find((color) => color.name === item.color)?.images?.[0] ??
    item.product?.images?.[0];

  // view product link
  const viewProductLink =
    item.size && item.size !== "free"
      ? `/products/${item.product.slug}?size=${item.size}&color=${item.color}`
      : item.size === "free" && item.color
        ? `/products/${item.product.slug}?color=${item.color}`
        : `/products/${item.product.slug}`;

  return (
    <>
      <tr>
        <td className="p-6 ps-0 text-start text-sm font-medium">
          <div className="flex items-center sm:items-start gap-4">
            <Image
              src={
                selectedImage?.formats?.small?.url || selectedImage?.url || ""
              }
              alt={
                selectedImage?.alternativeText ||
                item.product.name ||
                "Product Image"
              }
              width={96}
              height={96}
              className="sm:aspect-square object-cover object-center rounded"
              loading="lazy"
            />
            <div className="space-y-1 pt-2">
              <h2 className="text-base font-barlow leading-tight font-medium">
                {item.product.name}
              </h2>
              <p className="text-sm font-light">
                {item.size && item.size !== "undefined" && (
                  <>
                    {item.size !== "free" && <span>{item.size} </span>}
                    {item.size !== "free" && item.color && <span>/ </span>}
                    {item.color && <span>{item.color}</span>}
                  </>
                )}
              </p>
              <ProductPrice price={item.product.price} className="sm:hidden" />
              <p className="font-light">Qty: {item.quantity}</p>
              <Button
                asChild
                variant="link"
                size="sm"
                className="sm:hidden text-sky-700 p-0"
              >
                <Link href={viewProductLink}>View product</Link>
              </Button>
            </div>
          </div>
        </td>
        <td className="hidden sm:table-cell p-6 ps-0 text-center text-sm text-gray-500">
          <ProductPrice price={item.product.price} />
        </td>
        <td className="hidden sm:table-cell p-6 ps-0 text-center text-sm text-gray-500">
          Delivered
        </td>
        <td className="py-6 text-end">
          <Button
            asChild
            variant="link"
            size="sm"
            className="text-sky-700 px-0 hidden sm:inline-flex"
          >
            <Link href={viewProductLink}>View product</Link>
          </Button>
        </td>
      </tr>
    </>
  );
}
