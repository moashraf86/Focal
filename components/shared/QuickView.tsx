// components/global/QuickView.tsx
"use client";
import { useQuickView } from "@/hooks/useQuickView";
import QuickViewDrawer from "@/components/shared/QuickViewDrawer";

export default function QuickView() {
  const { isOpen, product, ...state } = useQuickView();

  if (!product) return null;

  return (
    <QuickViewDrawer
      isOpen={isOpen}
      product={product}
      onClose={state.closeQuickView}
      {...state}
    />
  );
}
