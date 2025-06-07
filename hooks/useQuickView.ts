"use client";

import * as React from "react";
import { Color, Product, Size } from "@/lib/definitions";

type QuickViewState = {
  isOpen: boolean;
  product: Product | null;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
};

const listeners = new Set<(state: QuickViewState) => void>();
let memoryState: QuickViewState = {
  isOpen: false,
  product: null,
  selectedSize: "",
  selectedColor: "",
  quantity: 1,
};

export function useQuickView() {
  const [state, setState] = React.useState<QuickViewState>(memoryState);

  React.useEffect(() => {
    listeners.add(setState);
    return () => void listeners.delete(setState);
  }, []);

  const updateState = (partial: Partial<QuickViewState>) => {
    memoryState = { ...memoryState, ...partial };
    listeners.forEach((listener) => listener(memoryState));
  };

  const openQuickView = (
    product: Product,
    chosenSize: Size,
    chosenColor: Color | undefined
  ) => {
    updateState({
      isOpen: true,
      product,
      selectedSize: chosenSize.value || "",
      selectedColor: chosenColor?.name || "",
      quantity: 1,
    });
  };

  const closeQuickView = () => {
    updateState({
      isOpen: false,
      selectedSize: "",
      selectedColor: "",
      quantity: 1,
    });
  };

  const setQuantity = (qty: number) => updateState({ quantity: qty });

  return {
    ...state,
    openQuickView,
    closeQuickView,
    updateState,
    setQuantity,
  };
}
