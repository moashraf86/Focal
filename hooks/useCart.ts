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
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isUpdatingProduct, setIsUpdatingProduct] = useState(false);
  const [currentUpdatingProduct, setCurrentUpdatingProduct] = useState<
    string | null
  >(null);
  const {
    data: cartItems = [],
    error,
    isLoading: swrLoading,
  } = useSWR<CartItem[]>(
    userLoaded && email ? ["cart", email] : null,
    () => fetcher(email),
    {
      fallbackData: loadFromLocalStorage(),
      onSuccess: (data) => {
        saveToLocalStorage(data);
      },
    }
  );
  const isLoading = swrLoading || !userLoaded;

  // 1. add product to cart
  const addProductToCart = async (
    product: Product,
    quantity: number,
    size: string,
    color?: string | undefined
  ) => {
    try {
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Product added to cart",
        description: "Item has been added to your cart",
      });
      mutate(["cart", email]);
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

  // 2. remove product from cart
  const removeCartItem = async (itemId: string) => {
    try {
      if (!email) throw new Error("User email is missing");
      await apiRemoveCartItem(itemId);
      mutate(["cart", email]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove product from cart",
        variant: "destructive",
      });
      console.error("Error removing product from cart:", error);
    }
  };

  // 3. update item quantity
  const updateItemQuantity = async (itemId: string, quantity: number) => {
    try {
      if (!email) throw new Error("User email is missing");
      setIsUpdatingProduct(true);
      setCurrentUpdatingProduct(itemId);
      await apiUpdateItemQuantity(itemId, quantity);
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast({
        title: "Product quantity updated",
        description: "Item quantity has been updated",
      });
      mutate(["cart", email]);
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

  // 5. clear cart
  const clearCart = async () => {
    try {
      await Promise.all(
        cartItems.map((item) => removeCartItem(item.documentId))
      );
      mutate(["cart", email]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      });
      console.error("Error clearing cart:", error);
    }
  };

  // 6. sync local cart with server cart
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
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
