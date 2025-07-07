import qs from "qs";

type filterType = {
  [key: string]: string | string[] | undefined;
};

import {
  Category,
  Face,
  Product,
  SingleStrapiResponse,
  StrapiResponse,
} from "./definitions";

// Fetch all products (base data - heavily cached)
export async function fetchAllProductsBase(): Promise<{ products: Product[] }> {
  const query = qs.stringify({
    sort: ["createdAt:desc"],
    populate: {
      collections: {
        fields: ["name", "slug"],
      },
      categories: {
        fields: ["name", "slug"],
      },
      images: {
        fields: ["url", "alternativeText", "formats"],
      },
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
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/products?${query}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
      next: {
        tags: ["products-base"],
        revalidate: 3600,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const response: StrapiResponse<Product> = await res.json();
  return { products: response.data };
}

// Fetch all products with filters
export async function fetchAllProducts({
  sort = "createdAt:desc",
  size,
  color,
  price_min,
  price_max,
  collection,
}: filterType = {}): Promise<{ products: Product[] }> {
  // if there are no filters, use cache version (base data)
  const hasFilters =
    size ||
    color ||
    price_min ||
    price_max ||
    collection ||
    sort !== "createdAt:desc";

  if (!hasFilters) {
    return fetchAllProductsBase();
  }

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
      categories: {
        fields: ["name", "slug"],
      },
      images: {
        fields: ["url", "alternativeText", "formats"],
      },
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
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/products?${query}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
      next: {
        tags: ["products-filtered"],
        revalidate: 300, // shorter cache for filtered products
      },
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

// Base fetch function for products by category (static, heavily cached)
export async function fetchProductsByCategoryBase(
  slug: string | string[]
): Promise<{ products: Product[] }> {
  const query = qs.stringify({
    filters: {
      categories: {
        slug: {
          $eq: slug,
        },
      },
    },
    sort: ["createdAt:desc"],
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
        fields: ["url", "alternativeText", "formats"],
      },
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
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/products?${query}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
      next: {
        revalidate: 3600,
        tags: ["products", `category-base:${slug}`],
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const response: StrapiResponse<Product> = await res.json();
  return { products: response.data };
}

// Fetch by category
export async function fetchProductsByCategory(
  { slug, sort, size, color, price_min, price_max, collection }: filterType = {
    sort: "createdAt:desc",
  }
): Promise<{ products: Product[] }> {
  if (!slug) {
    throw new Error("No slug provided");
  }

  const hasFilters =
    size ||
    color ||
    price_min ||
    price_max ||
    collection ||
    sort !== "createdAt:desc";

  if (!hasFilters) {
    return fetchProductsByCategoryBase(slug);
  }

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
        fields: ["url", "alternativeText", "formats"],
      },
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
  });
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/products?${query}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
      next: { revalidate: 3600, tags: ["products", `category:${slug}`] },
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

// Fetch product by id
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
      next: { revalidate: 3600, tags: ["product", slug] },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }
  const response: SingleStrapiResponse<Product[]> = await res.json();

  const product = response.data[0];

  return { product };
}

// Fetch all related products
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
        fields: ["url", "alternativeText", "formats"],
      },
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
  });
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/products?${query}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
      next: { revalidate: 3600, tags: ["products", `related:${cat}`] },
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

export async function searchProducts(queryText: string): Promise<Product[]> {
  const query = qs.stringify({
    filters: {
      $or: [
        {
          name: {
            $containsi: queryText,
          },
        },
      ],
    },
    populate: {
      images: {
        fields: ["url", "alternativeText", "formats"],
      },
      collections: {
        fields: ["name", "slug"],
      },
      categories: {
        fields: ["name", "slug"],
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
      next: { revalidate: 3600, tags: ["search", `search:${queryText}`] },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch search results");
  }

  const data: StrapiResponse<Product> = await res.json();
  return data.data;
}

// Fetch cart products from strapi
export async function fetchCartItems(email: string | undefined) {
  const query = qs.stringify({
    filter: {
      email: {
        $eq: email,
      },
    },
    populate: {
      cart_items: {
        fields: ["quantity", "size", "color", "createdAt"],
        populate: {
          product: {
            fields: ["name", "slug", "price"],
            populate: {
              images: {
                fields: ["url", "alternativeText", "formats"],
              },
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
      next: { revalidate: 3600, tags: ["cart", `cart:${email}`] },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch cart items");
  }

  // simulate delay for testing
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const response: StrapiResponse<Product> = await res.json();

  const cartItems = response.data[0]?.cart_items || [];

  return cartItems;
}

// Fetch order by id
export const fetchOrderById = async (id: string) => {
  try {
    const query = qs.stringify({
      populate: {
        order_items: {
          populate: {
            product: {
              fields: ["name", "slug", "price"],
              populate: {
                images: {
                  fields: ["url", "alternativeText", "formats"],
                },
                sizes: {
                  fields: ["value"],
                  populate: {
                    colors: {
                      fields: ["name"],
                      populate: {
                        images: {
                          fields: ["url", "alternativeText", "formats"],
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
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/orders/${id}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
        },
        next: { tags: ["order", `order:${id}`] },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        `Failed to fetch order: ${errorData.error || "Unknown error"}`
      );
    }

    const response = await res.json();
    const order = response.data;
    return order;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in fetchOrderById:", error.message);
    } else {
      console.error("Error in fetchOrderById:", error);
    }
    throw error;
  }
};

// Fetch all orders
export const fetchOrders = async (email: string | undefined) => {
  const query = qs.stringify({
    filters: {
      email: {
        $eq: email,
      },
    },
    populate: {
      order_items: {
        populate: {
          product: {
            populate: {
              images: {
                fields: ["url", "alternativeText", "formats"],
              },
              sizes: {
                fields: ["value"],
                populate: {
                  colors: {
                    fields: ["name"],
                    populate: {
                      images: {
                        fields: ["url", "alternativeText", "formats"],
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
  // if no email is provided, return empty array
  if (!email) return [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/orders?${query}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
        },
        next: { tags: ["orders", `orders:${email}`] },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        `Failed to fetch orders: ${errorData.error || "Unknown error"}`
      );
    }
    // simulate delay for testing
    await new Promise((resolve) => setTimeout(resolve, 500));

    const response = await res.json();
    const orders = response.data || [];
    return orders;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in fetchOrders:", error.message);
    } else {
      console.error("Error in fetchOrders:", error);
    }
    throw error;
  }
};

// Fetch all categories
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
      next: { revalidate: 3600, tags: ["categories"] },
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

// Fetch all faces
export async function fetchFaces(): Promise<{ faces: Face[] }> {
  // build deep query string to fetch product by slug with all related data
  const query = qs.stringify({
    populate: {
      fields: ["name", "slug", "description"],
      banner: {
        fields: ["url", "alternativeText"],
      },
    },
  });
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/faces?${query}&sort=createdAt:asc`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
      next: { revalidate: 3600, tags: ["faces"] },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch faces");
  }

  const response: StrapiResponse<Face> = await res.json();

  const faces = response.data;

  return {
    faces,
  };
}

// Fetch by face
export async function fetchProductsByFace({
  slug,
  sort = "createdAt:desc",
  size,
  color,
  price_min,
  price_max,
  collection,
}: filterType = {}): Promise<{ products: Product[] }> {
  const query = qs.stringify({
    filters: {
      faces: {
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
        fields: ["url", "alternativeText", "formats"],
      },
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
  });
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/products?${query}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
      next: { revalidate: 3600, tags: ["products", `face:${slug}`] },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const response: StrapiResponse<Product> = await res.json();

  console.log("fetchProductsByFace", response);

  const products = response.data;

  return {
    products,
  };
}
