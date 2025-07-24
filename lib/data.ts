import qs from "qs";

type filterType = {
  [key: string]: string | string[] | undefined;
};

import {
  Category,
  Face,
  Order,
  Product,
  SingleStrapiResponse,
  StrapiResponse,
} from "./definitions";

// Cache for storing frequently accessed data
const cache = new Map<
  string,
  { data: unknown; timestamp: number; ttl: number }
>();

// Cache utility functions
const getCacheKey = (
  prefix: string,
  params: Record<string, unknown>
): string => {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((result: Record<string, unknown>, key) => {
      result[key] = params[key];
      return result;
    }, {});
  return `${prefix}:${JSON.stringify(sortedParams)}`;
};

const getFromCache = <T>(key: string): T | null => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data as T;
  }
  cache.delete(key);
  return null;
};

const setCache = <T>(key: string, data: T, ttl: number): void => {
  cache.set(key, { data, timestamp: Date.now(), ttl });
};

// Optimized fetch function with retry logic and better error handling
const fetchWithRetry = async (
  url: string,
  options: RequestInit,
  retries = 3,
  delay = 1000
): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;

      // Don't retry on 4xx errors (client errors)
      if (response.status >= 400 && response.status < 500) {
        throw new Error(
          `Client error: ${response.status} ${response.statusText}`
        );
      }

      // Retry on 5xx errors (server errors)
      if (i === retries - 1) {
        throw new Error(
          `Server error after ${retries} retries: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) =>
        setTimeout(resolve, delay * Math.pow(2, i))
      );
    }
  }
  throw new Error("Max retries exceeded");
};

// Common populate configurations to reduce duplication
const POPULATE_CONFIGS = {
  basic: {
    collections: { fields: ["name", "slug"] },
    categories: { fields: ["name", "slug"] },
    images: { fields: ["url", "alternativeText", "formats"] },
  },

  withSizes: {
    sizes: {
      fields: ["value"],
      populate: {
        colors: {
          fields: ["name"],
          populate: {
            images: { fields: ["url", "alternativeText", "formats"] },
            pattern: { fields: ["url", "alternativeText"] },
          },
        },
      },
    },
  },

  withBanner: {
    banner: { fields: ["url", "alternativeText"] },
  },

  detailed: {
    bannerImage: { fields: ["url", "alternativeText"] },
    images: { fields: ["url", "alternativeText"] },
    categories: { fields: ["name", "slug"] },
    collections: { fields: ["name", "slug"] },
    faces: { fields: ["name", "slug", "description"] },
    sizes: {
      fields: ["value"],
      populate: {
        colors: {
          fields: ["name"],
          populate: {
            images: { fields: ["name", "alternativeText", "url", "formats"] },
            pattern: { fields: ["url", "alternativeText"] },
          },
        },
      },
    },
    buyWith: {
      fields: ["name", "slug", "price"],
      populate: {
        images: { fields: ["url", "alternativeText"] },
        sizes: {
          fields: ["value"],
          populate: {
            colors: {
              fields: ["name"],
              populate: {
                images: {
                  fields: ["name", "alternativeText", "url", "formats"],
                },
                pattern: { fields: ["url", "alternativeText"] },
              },
            },
          },
        },
      },
    },
  },
};

// Build filter object helper
const buildFilters = (filters: filterType) => {
  const result: Record<string, unknown> = {};

  if (filters.size || filters.color) {
    result.sizes = {
      ...(filters.size && {
        value: Array.isArray(filters.size)
          ? { $in: filters.size }
          : { $eq: filters.size },
      }),
      ...(filters.color && {
        colors: {
          name: Array.isArray(filters.color)
            ? { $in: filters.color }
            : { $eq: filters.color },
        },
      }),
    };
  }

  if (filters.price_min !== undefined || filters.price_max !== undefined) {
    result.price = {
      ...(filters.price_min !== undefined && { $gte: filters.price_min }),
      ...(filters.price_max !== undefined && { $lte: filters.price_max }),
    };
  }

  if (filters.collection) {
    result.collections = { slug: { $eq: filters.collection } };
  }

  return result;
};

// Enhanced base API function
const apiRequest = async <T>(
  endpoint: string,
  query: Record<string, unknown>,
  cacheKey?: string,
  cacheTtl = 3600000 // 1 hour default
): Promise<T> => {
  const startTime = performance.now();

  // Check cache first
  if (cacheKey) {
    const cached = getFromCache<T>(cacheKey);
    if (cached) {
      const cacheTime = performance.now() - startTime;
      console.log(
        `[Server Timing] ${endpoint} - Cache hit: ${cacheTime.toFixed(2)}ms`
      );
      return cached;
    }
  }

  const queryString = qs.stringify(query);
  const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${endpoint}?${queryString}`;

  const fetchStartTime = performance.now();
  const response = await fetchWithRetry(url, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    next: {
      tags: cacheKey ? [cacheKey.split(":")[0]] : undefined,
      revalidate: Math.floor(cacheTtl / 1000),
    },
  });
  const fetchTime = performance.now() - fetchStartTime;

  const parseStartTime = performance.now();
  const data = await response.json();
  const parseTime = performance.now() - parseStartTime;

  // Cache the result
  if (cacheKey) {
    setCache(cacheKey, data, cacheTtl);
  }

  const totalTime = performance.now() - startTime;

  // Log server timing data
  console.log(`[Server Timing] ${endpoint}:`, {
    total: `${totalTime.toFixed(2)}ms`,
    fetch: `${fetchTime.toFixed(2)}ms`,
    parse: `${parseTime.toFixed(2)}ms`,
    cacheKey: cacheKey || "none",
    status: response.status,
    url: url.split("?")[0], // Log endpoint without query params for cleaner output
  });

  return data;
};

// Fetch all products (base data - heavily cached)
export async function fetchAllProductsBase(): Promise<{ products: Product[] }> {
  const cacheKey = getCacheKey("products-base", {});

  const query = {
    sort: ["createdAt:desc"],
    populate: {
      ...POPULATE_CONFIGS.basic,
      ...POPULATE_CONFIGS.withSizes,
    },
  };

  const response: StrapiResponse<Product> = await apiRequest(
    "/products",
    query,
    cacheKey,
    3600000 // 1 hour
  );

  return { products: response.data };
}

// Fetch all products with filters (optimized)
export async function fetchAllProducts(
  filters: filterType = {}
): Promise<{ products: Product[] }> {
  const { sort = "createdAt:desc", ...otherFilters } = filters;

  // Check if we can use the base cached version
  const hasFilters =
    Object.keys(otherFilters).some((key) => otherFilters[key] !== undefined) ||
    sort !== "createdAt:desc";

  if (!hasFilters) {
    return fetchAllProductsBase();
  }

  const cacheKey = getCacheKey("products-filtered", filters);

  const query = {
    filters: buildFilters(filters),
    sort: [sort],
    populate: {
      ...POPULATE_CONFIGS.basic,
      ...POPULATE_CONFIGS.withSizes,
    },
  };

  const response: StrapiResponse<Product> = await apiRequest(
    "/products",
    query,
    cacheKey,
    300000 // 5 minutes for filtered results
  );

  return { products: response.data };
}

// Base fetch function for products by category (optimized)
export async function fetchProductsByCategoryBase(
  slug: string | string[]
): Promise<{ products: Product[] }> {
  const cacheKey = getCacheKey("category-base", { slug });

  const query = {
    filters: {
      categories: { slug: { $eq: slug } },
    },
    sort: ["createdAt:desc"],
    populate: {
      ...POPULATE_CONFIGS.basic,
      ...POPULATE_CONFIGS.withSizes,
      categories: {
        ...POPULATE_CONFIGS.basic.categories,
        populate: POPULATE_CONFIGS.withBanner,
      },
    },
  };

  const response: StrapiResponse<Product> = await apiRequest(
    "/products",
    query,
    cacheKey,
    3600000 // 1 hour
  );

  return { products: response.data };
}

// Fetch by category (optimized)
export async function fetchProductsByCategory(
  filters: filterType = {}
): Promise<{ products: Product[] }> {
  const { slug, sort = "createdAt:desc", ...otherFilters } = filters;

  if (!slug) {
    throw new Error("No slug provided");
  }

  const hasFilters =
    Object.keys(otherFilters).some((key) => otherFilters[key] !== undefined) ||
    sort !== "createdAt:desc";

  if (!hasFilters) {
    return fetchProductsByCategoryBase(slug);
  }

  const cacheKey = getCacheKey("category-filtered", filters);

  const query = {
    filters: {
      categories: { slug: { $eq: slug } },
      ...buildFilters(filters),
    },
    sort: [sort],
    populate: {
      ...POPULATE_CONFIGS.basic,
      ...POPULATE_CONFIGS.withSizes,
      categories: {
        ...POPULATE_CONFIGS.basic.categories,
        populate: POPULATE_CONFIGS.withBanner,
      },
    },
  };

  const response: StrapiResponse<Product> = await apiRequest(
    "/products",
    query,
    cacheKey,
    300000 // 5 minutes
  );

  return { products: response.data };
}

// Fetch product by slug (optimized)
export async function fetchProductBySlug(
  slug: string
): Promise<{ product: Product }> {
  const cacheKey = getCacheKey("product", { slug });

  const query = {
    filters: { slug: { $eq: slug } },
    populate: POPULATE_CONFIGS.detailed,
  };

  const response: SingleStrapiResponse<Product[]> = await apiRequest(
    "/products",
    query,
    cacheKey,
    3600000 // 1 hour
  );

  return { product: response.data[0] };
}

// Search products (optimized with debouncing consideration)
export async function searchProducts(queryText: string): Promise<Product[]> {
  if (!queryText.trim()) return [];

  const cacheKey = getCacheKey("search", {
    queryText: queryText.toLowerCase().trim(),
  });

  const query = {
    filters: {
      $or: [{ name: { $containsi: queryText } }],
    },
    populate: {
      ...POPULATE_CONFIGS.basic,
      sizes: {
        fields: ["value"],
        populate: {
          colors: { fields: ["name"] },
        },
      },
    },
  };

  const response: StrapiResponse<Product> = await apiRequest(
    "/products",
    query,
    cacheKey,
    1800000 // 30 minutes for search results
  );

  return response.data;
}

// Fetch order by id (optimized)
export const fetchOrderById = async (id: string): Promise<Order> => {
  const cacheKey = getCacheKey("order", { id });

  const query = {
    populate: {
      order_items: {
        populate: {
          product: {
            fields: ["name", "slug", "price"],
            populate: {
              images: { fields: ["url", "alternativeText", "formats"] },
              sizes: {
                fields: ["value"],
                populate: {
                  colors: {
                    fields: ["name"],
                    populate: {
                      images: { fields: ["url", "alternativeText", "formats"] },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  try {
    const response: SingleStrapiResponse<Order> = await apiRequest(
      `/orders/${id}`,
      query,
      cacheKey,
      3600000 // 1 hour
    );

    return response.data;
  } catch (error) {
    console.error("Error in fetchOrderById:", error);
    throw error;
  }
};

// Fetch all orders (optimized)
export const fetchOrders = async (email: string | undefined) => {
  if (!email) return [];

  const cacheKey = getCacheKey("orders", { email });

  const query = {
    filters: { email: { $eq: email } },
    populate: {
      order_items: {
        populate: {
          product: {
            populate: {
              images: { fields: ["url", "alternativeText", "formats"] },
              sizes: {
                fields: ["value"],
                populate: {
                  colors: {
                    fields: ["name"],
                    populate: {
                      images: { fields: ["url", "alternativeText", "formats"] },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  try {
    const response: StrapiResponse<Order> = await apiRequest(
      "/orders",
      query,
      cacheKey,
      300000 // 5 minutes for orders
    );

    return response.data;
  } catch (error) {
    console.error("Error in fetchOrders:", error);
    throw error;
  }
};

// Fetch all categories (optimized)
export async function fetchCategories(): Promise<{ categories: Category[] }> {
  const cacheKey = getCacheKey("categories", {});

  const query = {
    sort: ["createdAt:asc"],
    populate: {
      fields: ["name", "slug"],
      ...POPULATE_CONFIGS.withBanner,
    },
  };

  const response: StrapiResponse<Category> = await apiRequest(
    "/categories",
    query,
    cacheKey,
    7200000 // 2 hours - categories change infrequently
  );

  return { categories: response.data };
}

// Fetch all faces (optimized)
export async function fetchFaces(): Promise<{ faces: Face[] }> {
  const cacheKey = getCacheKey("faces", {});

  const query = {
    sort: ["createdAt:asc"],
    populate: {
      fields: ["name", "slug", "description"],
      ...POPULATE_CONFIGS.withBanner,
    },
  };

  const response: StrapiResponse<Face> = await apiRequest(
    "/faces",
    query,
    cacheKey,
    7200000 // 2 hours
  );

  return { faces: response.data };
}

// Fetch by face (optimized)
export async function fetchProductsByFace(
  filters: filterType = {}
): Promise<{ products: Product[] }> {
  const { slug, sort = "createdAt:desc" } = filters;

  if (!slug) {
    throw new Error("No slug provided");
  }

  const cacheKey = getCacheKey("face-products", filters);

  const query = {
    filters: {
      faces: { slug: { $eq: slug } },
      ...buildFilters(filters),
    },
    sort: [sort],
    populate: {
      ...POPULATE_CONFIGS.basic,
      ...POPULATE_CONFIGS.withSizes,
      categories: {
        ...POPULATE_CONFIGS.basic.categories,
        populate: POPULATE_CONFIGS.withBanner,
      },
    },
  };

  const response: StrapiResponse<Product> = await apiRequest(
    "/products",
    query,
    cacheKey,
    3600000 // 1 hour
  );

  return { products: response.data };
}

/**
 * Fetch bestselling products for a specific gender
 * @param gender - The gender category (e.g., 'men', 'women')
 * @returns Promise with bestselling products
 */
export async function fetchBestsellingProducts(
  gender: string
): Promise<{ products: Product[] }> {
  const cacheKey = getCacheKey("bestselling", { gender });

  const query = {
    filters: {
      collections: { slug: { $eq: "bestselling" } },
      categories: { slug: { $eq: gender } },
    },
    populate: {
      ...POPULATE_CONFIGS.basic,
      ...POPULATE_CONFIGS.withSizes,
    },
    pagination: { limit: 8 },
  };

  const response: StrapiResponse<Product> = await apiRequest(
    "/products",
    query,
    cacheKey,
    3600000 // 1 hour cache for frequently changing products
  );

  return { products: response.data };
}

/**
 * Fetch featured products
 * @returns Promise with featured products
 */
export async function fetchFeaturedProducts(): Promise<{
  products: Product[];
}> {
  const cacheKey = getCacheKey("featured", {});

  const query = {
    filters: {
      featured: {
        $eq: true,
      },
    },
    populate: {
      ...POPULATE_CONFIGS.basic,
      ...POPULATE_CONFIGS.withSizes,
      // ...POPULATE_CONFIGS.detailed,
      featuredBannerImg: { fields: ["url", "alternativeText"] },
    },
    pagination: { limit: 4 },
  };

  const response: StrapiResponse<Product> = await apiRequest(
    "/products",
    query,
    cacheKey,
    3600000 // 1 hour cache
  );

  return { products: response.data };
}
