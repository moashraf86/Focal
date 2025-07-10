"use client";

import { useIntersectionObserver } from "@uidotdev/usehooks";
import { useEffect, useRef } from "react";

const visibilityCallbacks = new Set<(visible: boolean) => void>();

export function useProductVisibilityObserver() {
  const [ref, entry] = useIntersectionObserver({
    threshold: 0.1,
    root: null,
    rootMargin: "0px",
  });

  const hasReported = useRef(false);

  useEffect(() => {
    if (entry?.isIntersecting !== undefined) {
      hasReported.current = true;
      const isVisible = entry?.isIntersecting ?? false;
      visibilityCallbacks.forEach((callback) => callback(isVisible));
    }
  }, [entry?.isIntersecting]);

  return ref;
}

export function useProductVisibilitySubscription(
  callback: (visible: boolean) => void
) {
  useEffect(() => {
    visibilityCallbacks.add(callback);
    return () => {
      visibilityCallbacks.delete(callback);
    };
  }, [callback]);
}
