import { OrderItem as OrderItemType } from "@/lib/definitions";
import Image from "next/image";
import ProductPrice from "../product/ProductPrice";
import { Button } from "../ui/button";
import Link from "next/link";

export default function OrderItem({ item }: { item: OrderItemType }) {
  return (
    <>
      <tr>
        <td className="p-6 ps-0 text-start text-sm font-medium">
          <div className="flex items-center sm:items-start gap-4">
            <Image
              src={item.product.images[0].formats.small.url}
              alt={item.product.images[0].alternativeText}
              width={100}
              height={100}
              className="sm:aspect-square object-cover object-center rounded"
              loading="lazy"
            />
            <div className="space-y-1 pt-2">
              <h2 className="text-base font-barlow leading-tight hover:underline underline-offset-2 font-normal">
                {item.product.name}
              </h2>
              <p className="text-sm font-light">
                {item.size} / {item.color}
              </p>
              <ProductPrice price={item.product.price} className="sm:hidden" />
              <p className="font-light">Qty: {item.quantity}</p>
              <Button
                asChild
                variant="link"
                size="sm"
                className="sm:hidden text-sky-700 p-0"
              >
                <Link href={`/products/${item.product.slug}`}>
                  View product
                </Link>
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
            <Link href={`/products/${item.product.slug}`}>View product</Link>
          </Button>
        </td>
      </tr>
    </>
  );
}
