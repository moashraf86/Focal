"use client";
import { Product } from "@/lib/definitions";
import { useCallback, useState } from "react";

export function useQuickView() {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  const openQuickView = useCallback((product: Product) => {
    setProduct(product);
    setIsOpen(true);
  }, []);

  const closeQuickView = useCallback(() => {
    setProduct(null);
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    product,
    setIsOpen,
    openQuickView,
    closeQuickView,
  };
}
