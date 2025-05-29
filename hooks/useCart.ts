import { fetchCartItems } from "@/lib/data";
import {
  addProductToCart as apiAddProductToCart,
  removeCartItem as apiRemoveCartItem,
  updateItemQuantity as apiUpdateItemQuantity,
} from "@/lib/actions";
import { CartItem, Product } from "@/lib/definitions";
import { useUser } from "@clerk/nextjs";
import useSWR, { mutate } from "swr";
import { toast } from "./use-toast";
import { useEffect, useState } from "react";
import {
  CART_KEY,
  loadFromLocalStorage,
  saveToLocalStorage,
} from "@/lib/localStorage";

const fetcher = (email: string | undefined) => fetchCartItems(email);

export const useCart = () => {
  const { user, isLoaded: userLoaded } = useUser();
  const email = user?.emailAddresses[0]?.emailAddress;
  const username = user?.fullName;

  const isGuest = !email;

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isUpdatingProduct, setIsUpdatingProduct] = useState(false);
  const [currentUpdatingProduct, setCurrentUpdatingProduct] = useState<
    string | null
  >(null);
  const swrKey = !isGuest && userLoaded ? ["cart", email] : "guest-cart";

  const {
    data: cartItems = [],
    error,
    isLoading: swrLoading,
  } = useSWR<CartItem[]>(
    swrKey,
    () => {
      if (isGuest) {
        return Promise.resolve(loadFromLocalStorage());
      } else {
        return fetcher(email);
      }
    },
    {
      fallbackData: isGuest ? loadFromLocalStorage() : [],
      onSuccess: (data) => isGuest && saveToLocalStorage(data),
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  const isLoading = swrLoading || !userLoaded;

  // 🟢 Add product to cart (guest and signed-in)
  const addProductToCart = async (
    product: Product,
    quantity: number,
    size: string,
    color?: string
  ) => {
    try {
      if (isGuest) {
        setIsAddingProduct(true);
        await new Promise((resolve) => setTimeout(resolve, 200));
        // handle guest cart (localStorage)
        const existingCart = loadFromLocalStorage();
        const updatedCart = [...existingCart];
        const existingIndex = updatedCart.findIndex(
          (item) =>
            item.product.id === product.id &&
            item.size === size &&
            item.color === color
        );

        if (existingIndex > -1) {
          // update quantity
          updatedCart[existingIndex].quantity += quantity;
        } else {
          // add new item
          updatedCart.push({
            id: product.id,
            createdAt: product.createdAt,
            documentId: crypto.randomUUID(), // or use a uuid lib
            product,
            quantity,
            size,
            color,
          });
        }
        saveToLocalStorage(updatedCart);
        mutate(swrKey, updatedCart, false);
        return;
      }

      // logged-in user logic
      if (!email || !username) throw new Error("User email is missing");
      setIsAddingProduct(true);
      await apiAddProductToCart(
        email,
        username,
        quantity,
        size,
        product,
        color
      );
      await new Promise((resolve) => setTimeout(resolve, 200));
      mutate(swrKey);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to cart",
        variant: "destructive",
      });
      console.error("Error adding product to cart:", error);
    } finally {
      setIsAddingProduct(false);
    }
  };

  // 🔴 Remove item (guest and signed-in)
  const removeCartItem = async (itemId: string) => {
    try {
      if (isGuest) {
        const updatedCart = cartItems.filter(
          (item) => item.documentId !== itemId
        );
        saveToLocalStorage(updatedCart);
        mutate(swrKey, updatedCart, false);
      } else {
        if (!email) throw new Error("User email is missing");
        await apiRemoveCartItem(itemId);
        mutate(swrKey);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove product from cart",
        variant: "destructive",
      });
      console.error("Error removing product from cart:", error);
    }
  };

  // 🟡 Update quantity (guest and signed-in)
  const updateItemQuantity = async (itemId: string, quantity: number) => {
    try {
      setIsUpdatingProduct(true);
      setCurrentUpdatingProduct(itemId);
      if (isGuest) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        const updatedCart = cartItems.map((item) =>
          item.documentId === itemId ? { ...item, quantity } : item
        );
        saveToLocalStorage(updatedCart);
        mutate(swrKey, updatedCart, false);
      } else {
        if (!email) throw new Error("User email is missing");
        await apiUpdateItemQuantity(itemId, quantity);
        await new Promise((resolve) => setTimeout(resolve, 200));
        mutate(swrKey);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product quantity",
        variant: "destructive",
      });
      console.error("Error updating product quantity:", error);
    } finally {
      setCurrentUpdatingProduct(null);
      setIsUpdatingProduct(false);
    }
  };

  // 🔁 clearCart: also check if guest
  const clearCart = async () => {
    try {
      if (isGuest) {
        localStorage.removeItem(CART_KEY);
        mutate(swrKey, [], false);
      } else {
        await Promise.all(
          cartItems.map((item) => apiRemoveCartItem(item.documentId))
        );
        mutate(["cart", email]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      });
      console.error("Error clearing cart:", error);
    }
  };

  // localStorage sync
  useEffect(() => {
    if (cartItems && cartItems.length > 0 && isGuest) {
      saveToLocalStorage(cartItems);
    } else {
      localStorage.removeItem(CART_KEY);
    }
  }, [cartItems]);

  return {
    cartItems,
    isLoading,
    isEmpty: cartItems.length === 0 && !isLoading,
    isAdding: isAddingProduct,
    isUpdating: isUpdatingProduct,
    currentUpdatingProduct,
    error,
    addProductToCart,
    removeCartItem,
    updateItemQuantity,
    clearCart,
    getTotalItems: () =>
      cartItems.reduce((total, item) => total + item.quantity, 0),
    getTotalPrice: () =>
      cartItems.reduce(
        (total, item) => total + item.product?.price * item.quantity,
        0
      ),
  };
};
