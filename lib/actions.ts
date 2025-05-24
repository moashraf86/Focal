"use server";

import { revalidatePath } from "next/cache";
import { Address, CartItem, PaymentMethod, Product } from "./definitions";

// [1] create cart entry
export const createCart = async (data: {
  username: string;
  email: string | undefined;
}) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/carts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          username: data.username,
          email: data.email,
        },
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        `Failed to create cart: ${errorData.error || "Unknown error"}`
      );
    }

    const response = await res.json();
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createCart:", error.message);
    } else {
      console.error("Error in createCart:", error);
    }
    throw error;
  }
};

// [2] add product to cart
export const addProductToCart = async (
  email: string | undefined,
  username: string,
  quantity: number,
  size: string | null,
  product: Product,
  color?: string | undefined
) => {
  try {
    // Fetch existing cart for the user
    const cartRes = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/carts?filters[email][$eq]=${email}&populate[cart_items][populate]=product`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
        },
      }
    );

    if (!cartRes.ok) {
      throw new Error("Failed to fetch cart");
    }

    const cartData = await cartRes.json();

    let cart = cartData.data[0];

    if (!cart) {
      // Create a new cart if none exists
      const newCart = await createCart({ username, email });
      cart = newCart.data;
    }

    // Ensure cart and cart items exist
    const cartItems = cart.cart_items || [];

    // Check if the product already exists in the cart
    const existingCartItem = cartItems.find(
      (item: CartItem) =>
        item.product.id === product.id &&
        item.size === size &&
        item.color === color
    );

    if (existingCartItem) {
      // Update the quantity of the existing cart item
      const updateRes = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/cart-items/${existingCartItem.documentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          },
          body: JSON.stringify({
            data: {
              quantity: existingCartItem.quantity + quantity,
            },
          }),
        }
      );

      if (!updateRes.ok) {
        const errorData = await updateRes.json();
        throw new Error(
          `Failed to update cart item: ${errorData.error || "Unknown error"}`
        );
      }

      const updatedCartItem = await updateRes.json();
      return updatedCartItem;
    } else {
      // Add a new cart item
      const addItemRes = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/cart-items`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          },
          body: JSON.stringify({
            data: {
              quantity: quantity,
              size,
              cart: cart.id,
              product: product.id,
              color: color,
            },
          }),
        }
      );

      if (!addItemRes.ok) {
        const errorData = await addItemRes.json();
        throw new Error(
          `Failed to add product to cart: ${errorData.error || "Unknown error"}`
        );
      }

      const newCartItem = await addItemRes.json();

      return newCartItem;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in addProductToCart:", error.message);
    } else {
      console.error("Error in addProductToCart:", error);
    }
    throw error;
  }
};

// [3] remove cart item
export const removeCartItem = async (cartItemId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/cart-items/${cartItemId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        `Failed to remove cart item: ${errorData.error || "Unknown error"}`
      );
    }

    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in removeCartItem:", error.message);
    } else {
      console.error("Error in removeCartItem:", error);
    }
    throw error;
  }
};

// [4] increase product quantity
export const updateItemQuantity = async (
  cartItemId: string,
  quantity: number
) => {
  try {
    // update cart item quantity
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/cart-items/${cartItemId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            quantity,
          },
        }),
      }
    );

    console.log("updateItemQuantity", res.url);

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        `Failed to update cart item quantity: ${
          errorData.error || "Unknown error"
        }`
      );
    }

    const updatedCartItem = await res.json();
    return updatedCartItem;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in increaseProductQuantity:", error.message);
    } else {
      console.error("Error in increaseProductQuantity:", error);
    }
    throw error;
  }
};

// [5] create order
export const createOrder = async (data: {
  name: string;
  email: string | undefined;
  amount: number;
  payment_id: string;
  order_number?: string;
  shipping_address: Address | undefined;
  payment_method: PaymentMethod;
}) => {
  try {
    // 1. Fetch the user's cart and its items
    const cartRes = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/carts?filters[email][$eq]=${data.email}&populate[cart_items][populate]=product`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
        },
      }
    );

    if (!cartRes.ok) throw new Error("Failed to fetch cart");

    const cartData = await cartRes.json();

    const cart = cartData.data[0];

    if (!cart) throw new Error("Cart not found");

    const cartItems = cart.cart_items || [];

    // 2. Create the order
    const orderRes = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            name: data.name,
            email: data.email,
            amount: data.amount,
            payment_id: data.payment_id,
            order_number: `${crypto.randomUUID().split("-")[0].toUpperCase()}`,
            shipping_address: data.shipping_address || "No address provided",
            payment_method: data.payment_method,
          },
        }),
      }
    );

    if (!orderRes.ok) {
      const errorData = await orderRes.json();
      throw new Error(`Failed to create order: ${errorData.error}`);
    }

    const order = await orderRes.json();
    const orderId = order.data.id;

    // 3. Create order items
    for (const cartItem of cartItems) {
      const product = cartItem.product;
      const quantity = cartItem.quantity;
      const price = product.price;
      const total = price * quantity;
      const size = cartItem.size;
      const color = cartItem.color;

      if (!product) continue; // Skip invalid products

      // Create OrderItem
      await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/order-items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            quantity,
            price,
            total,
            size,
            color,
            product: product.id,
            order: orderId,
          },
        }),
      });
    }

    // 5. Clean up: Delete cart items and cart
    for (const item of cartItems) {
      await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/cart-items/${item.documentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          },
        }
      );
    }
    await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/carts/${cart.documentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
        },
      }
    );

    // 6. Return the created order
    return order;
  } catch (error: unknown) {
    console.error("Error creating order:", error);
    throw error;
  } finally {
    revalidatePath("/orders");
  }
};
