import qs from "qs";

type filterType = {
  [key: string]: string | string[] | undefined;
};

import {
  Category,
  Product,
  SingleStrapiResponse,
  StrapiResponse,
} from "./definitions";
// [1] fetch all products
export async function fetchAllProducts(
  { sort, size, color, price_min, price_max, collection }: filterType = {
    sort: "createdAt:desc",
  }
): Promise<{ products: Product[] }> {
  // build deep query string to fetch product by slug with all related data
  const query = qs.stringify({
    filters: {
      sizes: {
        value: Array.isArray(size) ? { $in: size } : { $eq: size },
        colors: {
          name: Array.isArray(color) ? { $in: color } : { $eq: color },
        },
      },
      ...(price_min !== undefined || price_max !== undefined
        ? {
            price: {
              ...(price_min !== undefined && { $gte: price_min }),
              ...(price_max !== undefined && { $lte: price_max }),
            },
          }
        : {}),
      ...(collection && {
        collections: {
          slug: {
            $eq: collection,
          },
        },
      }),
    },
    sort: [sort],
    populate: {
      collections: {
        fields: ["name", "slug"],
      },
      images: {
        fields: ["url", "alternativeText"],
      },
      sizes: {
        fields: ["value"],
        populate: {
          colors: {
            fields: ["name"],
            populate: {
              images: {
                fields: ["url", "alternativeText"],
              },
              pattern: {
                fields: ["url", "alternativeText"],
              },
            },
          },
        },
      },
    },
  });
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/products?${query}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
      next: { revalidate: 60, tags: ["products"] },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const response: StrapiResponse<Product> = await res.json();

  const products = response.data;

  return {
    products,
  };
}

// [2] fetch all related products
export async function fetchRelatedProducts(
  cat: string,
  face?: string
): Promise<{ products: Product[] }> {
  // build deep query string to fetch product by slug with all related data
  const query = qs.stringify({
    filters: {
      categories: {
        slug: {
          $eq: cat,
        },
      },
      faces: {
        slug: {
          $eq: face,
        },
      },
    },
    populate: {
      images: {
        fields: ["url", "alternativeText"],
      },
      sizes: {
        fields: ["value"],
        populate: {
          colors: {
            fields: ["name"],
          },
        },
      },
    },
  });
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/products?${query}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
      next: { revalidate: 60, tags: [`related-products-${cat}-${face}`] },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const response: StrapiResponse<Product> = await res.json();

  const products = response.data;

  return {
    products,
  };
}

// [2] fetch by category
export async function fetchProductsByCategory(
  { slug, sort, size, color, price_min, price_max, collection }: filterType = {
    sort: "createdAt:desc",
  }
): Promise<{ products: Product[] }> {
  const query = qs.stringify({
    filters: {
      categories: {
        slug: {
          $eq: slug,
        },
      },
      ...((size || color) && {
        sizes: {
          value: Array.isArray(size) ? { $in: size } : { $eq: size },
          colors: {
            name: Array.isArray(color) ? { $in: color } : { $eq: color },
          },
        },
      }),
      ...(price_min !== undefined || price_max !== undefined
        ? {
            price: {
              ...(price_min !== undefined && { $gte: price_min }),
              ...(price_max !== undefined && { $lte: price_max }),
            },
          }
        : {}),
      ...(collection && {
        collections: {
          slug: {
            $eq: collection,
          },
        },
      }),
    },
    sort: [sort],
    populate: {
      collections: {
        fields: ["name", "slug"],
      },
      categories: {
        fields: ["name", "slug"],
        populate: {
          banner: {
            fields: ["url", "alternativeText"],
          },
        },
      },
      images: {
        fields: ["url", "alternativeText"],
      },
      sizes: {
        fields: ["value"],
        populate: {
          colors: {
            fields: ["name"],
            populate: {
              images: {
                fields: ["url", "alternativeText"],
              },
              pattern: {
                fields: ["url", "alternativeText"],
              },
            },
          },
        },
      },
    },
  });
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/products?${query}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
      next: { revalidate: 60, tags: ["products", `category:${slug}`] },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const response: StrapiResponse<Product> = await res.json();

  console.log("fetchProductsByCategory", response);

  const products = response.data;

  return {
    products,
  };
}

// [3] fetch bestselling products
export async function fetchBestSellingProducts(
  gender: string
): Promise<{ products: Product[] }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/products?populate=*&filters[$and][0][categories][name][$eq]=bestselling&filters[$and][1][categories][name][$eq]=${gender}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  // simulate long loading for 2 seconds
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const response: StrapiResponse<Product> = await res.json();

  const products = response.data;

  return {
    products,
  };
}

// [4] fetch product by id
export async function fetchProductBySlug(
  slug: string
): Promise<{ product: Product }> {
  // build deep query string to fetch product by slug with all related data
  const query = qs.stringify({
    filters: {
      slug: {
        $eq: slug,
      },
    },
    // encodeValuesOnly: true,
    populate: {
      bannerImage: {
        fields: ["url", "alternativeText"],
      },
      images: {
        fields: ["url", "alternativeText"],
      },
      categories: {
        fields: ["name", "slug"],
      },
      faces: {
        fields: ["name", "slug", "description"],
      },
      sizes: {
        fields: ["value"],
        populate: {
          colors: {
            fields: ["name"],
            populate: {
              images: {
                fields: ["name", "alternativeText", "url", "formats"],
              },
              pattern: {
                fields: ["url", "alternativeText"],
              },
            },
          },
        },
      },
      buyWith: {
        fields: ["name", "slug", "price"],
        populate: {
          images: {
            fields: ["url", "alternativeText"],
          },
          sizes: {
            fields: ["value"],
            populate: {
              colors: {
                fields: ["name"],
                populate: {
                  images: {
                    fields: ["name", "alternativeText", "url", "formats"],
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/products/?${query}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
      next: { revalidate: 60, tags: [slug] },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  const response: SingleStrapiResponse<Product[]> = await res.json();

  const product = response.data[0];

  return { product };
}

// [5] fetch cart products from strapi
export async function fetchCartItems(email: string | undefined) {
  const query = qs.stringify({
    filter: {
      email: {
        $eq: email,
      },
    },
    populate: {
      cart_items: {
        populate: {
          product: {
            fields: ["name", "slug", "price"],
            populate: {
              sizes: {
                fields: ["value"],
                populate: {
                  colors: {
                    fields: ["name"],
                    populate: {
                      images: {
                        fields: ["url", "alternativeText", "formats"],
                      },
                      pattern: {
                        fields: ["url", "alternativeText"],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/carts?${query}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch cart items");
  }

  const response: StrapiResponse<Product> = await res.json();

  const cartItems = response.data[0]?.cart_items || [];

  return cartItems;
}

// [6] fetch order by id
export const fetchOrderById = async (id: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/orders/${id}?populate[order_items][populate][product][populate]=*`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        `Failed to fetch order: ${errorData.error || "Unknown error"}`
      );
    }

    // simulate long loading for 2 seconds for development
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await res.json();
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in fetchOrderById:", error.message);
    } else {
      console.error("Error in fetchOrderById:", error);
    }
    throw error;
  }
};

// [7] fetch all orders
export const fetchOrders = async (email: string | undefined) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/orders?filters[email][$eq]=${email}&populate[order_items][populate][product][populate]=*`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        `Failed to fetch orders: ${errorData.error || "Unknown error"}`
      );
    }

    const response = await res.json();
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in fetchOrders:", error.message);
    } else {
      console.error("Error in fetchOrders:", error);
    }
    throw error;
  }
};

// [8] fetch all categories
export async function fetchCategories(): Promise<{ categories: Category[] }> {
  // build deep query string to fetch product by slug with all related data
  const query = qs.stringify({
    populate: {
      fields: ["name", "slug"],
      banner: {
        fields: ["url", "alternativeText"],
      },
    },
  });
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/categories?${query}&sort=createdAt:asc`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const response: StrapiResponse<Category> = await res.json();

  const categories = response.data;

  return {
    categories,
  };
}
