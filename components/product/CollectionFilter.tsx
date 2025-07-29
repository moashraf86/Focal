import { Collection } from "@/lib/definitions";
import { useEffect, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

export default function CollectionFilter({
  collections,
  availableCollections,
}: {
  collections: Collection[];
  availableCollections: Collection[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedCollection, setSelectedCollection] = useState<string[]>([]);
  // Update the URL query parameters based on selected filters
  const updateQueryParam = (key: string, values: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    params.delete(key);
    values.forEach((value) => params.append(key, value));
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Handle Collection filter changes
  const handleCollectionChange = (collection: string) => {
    //TODO: Scroll to the products section
    const current = new Set(selectedCollection);
    if (current.has(collection)) {
      current.delete(collection);
    } else {
      current.add(collection);
    }
    const newSelected = Array.from(current);
    setSelectedCollection(newSelected);
    updateQueryParam("collection", newSelected);
  };

  useEffect(() => {
    const collectionParam = searchParams.getAll("collection");
    if (collectionParam) {
      setSelectedCollection(collectionParam);
    }
  }, [searchParams]);

  return (
    <div className="space-y-3">
      {collections?.map((col) => {
        const isAvailable = availableCollections?.some(
          (collection) => collection.slug === col.slug
        );
        const isSelected = selectedCollection.includes(col.slug);
        return (
          <div
            key={col.id}
            className={cn("flex items-center gap-2 p-1", {
              "opacity-50 [&>label]:cursor-not-allowed": !isAvailable,
            })}
          >
            <Checkbox
              className="disabled:cursor-not-allowed disabled:bg-gray-400"
              id={col.slug}
              onCheckedChange={() => handleCollectionChange(col.slug)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleCollectionChange(col.slug)
              }
              checked={isSelected}
              disabled={!isAvailable}
            />
            <label
              htmlFor={col.slug}
              className="font-barlow text-sm cursor-pointer"
            >
              {col.name} ({col.count})
            </label>
          </div>
        );
      })}
    </div>
  );
}
