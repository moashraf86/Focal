"use client";

import { useState, useEffect } from "react";
import { useSearchDrawerController } from "@/hooks/useSearchDrawer";
import { searchProducts } from "@/lib/data";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { ArrowRight, Loader2, Search } from "lucide-react";
import { Input } from "../ui/input";
import { useDebounce } from "@uidotdev/usehooks";
import Link from "next/link";
import { Product } from "@/lib/definitions";
import Image from "next/image";
import ProductPrice from "../product/ProductPrice";

export default function SearchDrawer() {
  const { open, setOpen } = useSearchDrawerController();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Function to fetch search results based on the debounced query
  const fetchResults = async () => {
    if (!debouncedQuery || debouncedQuery.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const data = await searchProducts(debouncedQuery);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      setResults(data);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Reset on close
  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    // Fetch results whenever the debounced query changes
    fetchResults();
  }, [debouncedQuery]);

  // Function to highlight matching text in search results
  const highlightMatch = (text: string, match: string) => {
    const regex = new RegExp(`(${match})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-600 px-1">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="sm:max-w-[500px] overflow-y-auto overflow-x-hidden"
      >
        <SheetHeader className="sticky top-0 z-50 bg-background border-b border-border">
          <SheetTitle className="tracking-normal">
            <div className="flex items-center gap-2 grow mr-4">
              <Search className="inline-block mr-2" />
              <Input
                className="border-0 focus:ring-0 focus-visible:ring-transparent focus-visible:ring-0 focus:border-0 bg-transparent shadow-none font-barlow text-sm h-6 md:h-8"
                type="text"
                placeholder="What are you looking for?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setOpen(false);
                }}
                autoFocus
              />
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="p-4 space-y-2">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center space-x-2">
              <Loader2 className="animate-spin text-gray-500" />
              <p className="text-sm text-gray-500">Searching...</p>
            </div>
          )}

          {!loading && debouncedQuery && results.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center space-x-2">
              <p className="text-sm text-gray-500">No results found.</p>
            </div>
          )}

          {!loading &&
            results.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                onClick={() => setOpen(false)}
                className="group flex items-center p-3 gap-6"
              >
                <Image
                  src={product.images[0].formats.medium.url}
                  alt={product.images[0].alternativeText}
                  width="96"
                  height="120"
                  quality={100}
                  className="object-cover aspect-[4/5]"
                  loading="lazy"
                />
                <div className="space-y-2">
                  <p className="font-normal text-sm">
                    {highlightMatch(product.name, debouncedQuery)}
                  </p>
                  <ProductPrice
                    price={product.price}
                    className="text-primary"
                  />
                </div>
                <span className="inline-flex ml-auto relative opacity-0 transition-transform duration-300 ease-in-out group-hover:translate-x-0 group-hover:opacity-100 group-hover:-rotate-45">
                  <ArrowRight className="text-gray-600" />
                </span>
              </Link>
            ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
