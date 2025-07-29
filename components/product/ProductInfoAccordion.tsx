import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ProductDescription from "./ProductDescription";
import { Product } from "@/lib/definitions";

export default function ProductInfoAccordion({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  return (
    <Accordion type="single" collapsible className={className}>
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
              usually 2-4 working days. NB: For Countries outside EU buying
              items ex. VAT, be aware you have to pay import taxes according to
              the laws of that specific country. In case of returns we are not
              able to return any duties or taxes, as this is paid to and handled
              directly between you (the customer) and your country.
            </p>
          </div>
          <div className="space-y-1">
            <strong>Return policy</strong>
            <p>
              If you want to change a product into another size, color etc,
              please contact us so we are able to reserve the new item in our
              stock immediately. You are always entitled to an exchange or
              refund within 30 days after you have received your package, as
              long as the item has not been used. All original packaging, price
              labels etc. shall be returned with the product without having been
              tampered with.
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
