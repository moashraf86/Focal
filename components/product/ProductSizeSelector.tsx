import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Size } from "@/lib/definitions";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProductSizeSelector({
  sizes,
  defaultColor,
}: {
  sizes: Size[];
  defaultColor: string;
}) {
  const searchParams = useSearchParams();
  const url = useRouter();
  const selectedSize = searchParams.get("size") || sizes[0]?.value;

  // Handle size change
  const handleSizeChange = (value: string) => {
    url.push(`?size=${value}&color=${defaultColor}`, { scroll: false });
  };

  return (
    <div className="space-y-2">
      <span>Watch size:</span>
      <div className="flex items-center gap-2">
        {sizes.map((size) => (
          <Button
            key={size.id}
            variant="outline"
            className={cn(
              "text-sm font-barlow font-normal lowercase h-12 shadow-none",
              {
                "border-2 border-primary": selectedSize === size.value,
              }
            )}
            onClick={() => handleSizeChange(size.value)}
          >
            {size.value}
          </Button>
        ))}
      </div>
    </div>
  );
}
