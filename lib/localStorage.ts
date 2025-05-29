import { CartItem } from "./definitions";

export const CART_KEY = "cart_items";

export const saveToLocalStorage = (items: CartItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }
};

export const loadFromLocalStorage = (): CartItem[] => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(CART_KEY);
    if (data) return JSON.parse(data);
  }
  return [];
};
