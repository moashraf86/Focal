import qs from "qs";

type filterType = {
  [key: string]: string | string[] | number | undefined;
};

type Pagination = {
  total: number;
  limit: number;
  start: number;
};

const PAGE_LIMIT = 12;

import {
  Category,
  Face,
  Order,
  Product,
  SingleStrapiResponse,
  StrapiResponse,
} from "./definitions";

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

// Optimized fetch function
const fetchData = async <T>(
  endpoint: string,
  query: Record<string, unknown>,
  options: {
    tags?: string[];
    revalidate?: number | false;
  } = {}
): Promise<T> => {
  const queryString = qs.stringify(query, { encodeValuesOnly: true });
  const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${endpoint}?${queryString}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
    },
    next: {
      tags: options.tags,
      revalidate: options.revalidate,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
  }

  return response.json();
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

// Fetch all products (base data - heavily cached)
export async function fetchAllProductsBase(
  page: number
): Promise<{ products: Product[]; pagination: Pagination }> {
  const query = {
    sort: ["createdAt:desc"],
    populate: {
      ...POPULATE_CONFIGS.basic,
      ...POPULATE_CONFIGS.withSizes,
    },
    pagination: {
      limit: PAGE_LIMIT,
      start: (page - 1) * PAGE_LIMIT,
    },
  };

  const response: StrapiResponse<Product> = await fetchData(
    "/products",
    query,
    {
      tags: ["products-base"],
      revalidate: 3600, // 1 hour
    }
  );

  const pagination = response.meta.pagination as unknown as Pagination;

  return { products: response.data, pagination };
}

// Fetch all products with filters (optimized)
export async function fetchAllProducts(
  filters: filterType = {}
): Promise<{ products: Product[]; pagination: Pagination }> {
  const { sort = "createdAt:desc", page, ...otherFilters } = filters;

  // Check if we can use the base cached version (only if no filters and page 1)
  const hasFilters =
    Object.keys(otherFilters).some((key) => otherFilters[key] !== undefined) ||
    sort !== "createdAt:desc";

  if (!hasFilters && page) {
    return fetchAllProductsBase(page as number);
  }

  const query = {
    filters: buildFilters(filters),
    sort: [sort],
    populate: {
      ...POPULATE_CONFIGS.basic,
      ...POPULATE_CONFIGS.withSizes,
    },
    // Only add pagination if page is specified
    pagination: page
      ? {
          limit: PAGE_LIMIT,
          start: ((page as number) - 1) * PAGE_LIMIT,
        }
      : {
          limit: 1000,
          start: 0,
        },
  };

  const response: StrapiResponse<Product> = await fetchData(
    "/products",
    query,
    {
      tags: ["products-filtered"],
      revalidate: 3600, // 1 hour for filtered results
    }
  );

  // Create pagination object - if no pagination was requested, create a mock one
  const pagination = page
    ? (response.meta.pagination as unknown as Pagination)
    : {
        total: response.data.length,
        limit: response.data.length,
        start: 0,
      };

  return { products: response.data, pagination };
}

// Base fetch function for products by category (optimized)
export async function fetchProductsByCategoryBase(
  slug: string | string[],
  page: number
): Promise<{ products: Product[]; pagination: Pagination }> {
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
    pagination: {
      limit: PAGE_LIMIT,
      start: (page - 1) * PAGE_LIMIT,
    },
  };

  const response: StrapiResponse<Product> = await fetchData(
    "/products",
    query,
    {
      tags: ["category-base"],
      revalidate: 3600, // 1 hour
    }
  );

  const pagination = response.meta.pagination as unknown as Pagination;

  return { products: response.data, pagination };
}

// Fetch by category (optimized)
export async function fetchProductsByCategory(
  filters: filterType = {}
): Promise<{ products: Product[]; pagination: Pagination }> {
  const { slug, sort = "createdAt:desc", page, ...otherFilters } = filters;

  if (!slug) {
    throw new Error("No slug provided");
  }

  const hasFilters =
    Object.keys(otherFilters).some((key) => otherFilters[key] !== undefined) ||
    sort !== "createdAt:desc";

  if (!hasFilters && page) {
    return fetchProductsByCategoryBase(slug as string, filters.page as number);
  }

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
    ...(page && {
      pagination: {
        limit: PAGE_LIMIT,
        start: ((page as number) - 1) * PAGE_LIMIT,
      },
    }),
  };

  const response: StrapiResponse<Product> = await fetchData(
    "/products",
    query,
    {
      tags: ["category-filtered"],
      revalidate: 3600, // 1 hour
    }
  );

  const pagination = page
    ? (response.meta.pagination as unknown as Pagination)
    : {
        total: response.data.length,
        limit: response.data.length,
        start: 0,
      };

  return { products: response.data, pagination };
}

// Fetch product by slug (optimized)
export async function fetchProductBySlug(
  slug: string
): Promise<{ product: Product }> {
  const query = {
    filters: { slug: { $eq: slug } },
    populate: POPULATE_CONFIGS.detailed,
  };

  const response: SingleStrapiResponse<Product[]> = await fetchData(
    "/products",
    query,
    {
      tags: ["product"],
      revalidate: 3600, // 1 hour
    }
  );

  return { product: response.data[0] };
}

// Search products (optimized with debouncing consideration)
export async function searchProducts(queryText: string): Promise<Product[]> {
  if (!queryText.trim()) return [];

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

  const response: StrapiResponse<Product> = await fetchData(
    "/products",
    query,
    {
      tags: ["search"],
      revalidate: 3600, // 1 hour for search results
    }
  );

  return response.data;
}

// Fetch order by id (optimized)
export const fetchOrderById = async (id: string): Promise<Order> => {
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
    const response: SingleStrapiResponse<Order> = await fetchData(
      `/orders/${id}`,
      query,
      {
        tags: ["order"],
        revalidate: 3600, // 1 hour
      }
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
    const response: StrapiResponse<Order> = await fetchData("/orders", query, {
      tags: ["orders"],
      revalidate: 3600, // 1 hour for orders
    });

    return response.data;
  } catch (error) {
    console.error("Error in fetchOrders:", error);
    throw error;
  }
};

// Fetch all categories (optimized)
export async function fetchCategories(): Promise<{ categories: Category[] }> {
  const query = {
    sort: ["createdAt:asc"],
    populate: {
      fields: ["name", "slug"],
      ...POPULATE_CONFIGS.withBanner,
    },
  };

  const response: StrapiResponse<Category> = await fetchData(
    "/categories",
    query,
    {
      tags: ["categories"],
      revalidate: 7200, // 2 hours - categories change infrequently
    }
  );

  return { categories: response.data };
}

// Fetch all faces (optimized)
export async function fetchFaces(): Promise<{ faces: Face[] }> {
  const query = {
    sort: ["createdAt:asc"],
    populate: {
      fields: ["name", "slug", "description"],
      ...POPULATE_CONFIGS.withBanner,
    },
  };

  const response: StrapiResponse<Face> = await fetchData("/faces", query, {
    tags: ["faces"],
    revalidate: 7200, // 2 hours
  });

  return { faces: response.data };
}

// Fetch by face (optimized)
export async function fetchProductsByFaceBase(
  slug: string | string[],
  page: number
): Promise<{ products: Product[]; pagination: Pagination }> {
  const query = {
    filters: {
      faces: { slug: { $eq: slug } },
    },
    sort: ["createdAt:desc"],
    populate: {
      ...POPULATE_CONFIGS.basic,
      ...POPULATE_CONFIGS.withSizes,
      faces: {
        populate: POPULATE_CONFIGS.withBanner,
      },
    },
    pagination: {
      limit: PAGE_LIMIT,
      start: (page - 1) * PAGE_LIMIT,
    },
  };

  const response: StrapiResponse<Product> = await fetchData(
    "/products",
    query,
    {
      tags: ["face-base"],
      revalidate: 3600, // 1 hour
    }
  );

  const pagination = response.meta.pagination as unknown as Pagination;

  return { products: response.data, pagination };
}

// Fetch by face (optimized with pagination support)
export async function fetchProductsByFace(
  filters: filterType = {}
): Promise<{ products: Product[]; pagination: Pagination }> {
  const { slug, sort = "createdAt:desc", page, ...otherFilters } = filters;

  if (!slug) {
    throw new Error("No slug provided");
  }

  const hasFilters =
    Object.keys(otherFilters).some((key) => otherFilters[key] !== undefined) ||
    sort !== "createdAt:desc";

  // Use base cached version if no filters and page is specified
  if (!hasFilters && page) {
    return fetchProductsByFaceBase(slug as string, page as number);
  }

  const query = {
    filters: {
      faces: { slug: { $eq: slug } },
      ...buildFilters(filters),
    },
    sort: [sort],
    populate: {
      ...POPULATE_CONFIGS.basic,
      ...POPULATE_CONFIGS.withSizes,
      faces: {
        populate: POPULATE_CONFIGS.withBanner,
      },
    },
    // Only add pagination if page is specified
    ...(page && {
      pagination: {
        limit: PAGE_LIMIT,
        start: ((page as number) - 1) * PAGE_LIMIT,
      },
    }),
  };

  const response: StrapiResponse<Product> = await fetchData(
    "/products",
    query,
    {
      tags: ["face-filtered"],
      revalidate: 300, // 5 minutes for filtered results
    }
  );

  // Create pagination object - if no pagination was requested, create a mock one
  const pagination = page
    ? (response.meta.pagination as unknown as Pagination)
    : {
        total: response.data.length,
        limit: response.data.length,
        start: 0,
      };

  return { products: response.data, pagination };
}

/**
 * Optimized fetch for static generation
 */
const fetchStaticData = async <T>(
  endpoint: string,
  query: Record<string, unknown>,
  tags: string[]
): Promise<T> => {
  const queryString = qs.stringify(query);
  const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${endpoint}?${queryString}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
    },
    next: {
      tags: tags,
      revalidate: 3600, // 1 hour
    },
  });

  if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
  return response.json();
};

// Consolidated populate configuration
const BESTSELLING_POPULATE = {
  ...POPULATE_CONFIGS.basic,
  ...POPULATE_CONFIGS.withSizes,
};

const FEATURED_POPULATE = {
  ...POPULATE_CONFIGS.basic,
  ...POPULATE_CONFIGS.withSizes,
  featuredBannerImg: { fields: ["url", "alternativeText"] },
};

/**
 * Fetch bestselling products for a specific gender (optimized for static)
 */
export async function fetchBestsellingProducts(
  gender: string
): Promise<{ products: Product[] }> {
  const query = {
    filters: {
      collections: { slug: { $eq: "bestselling" } },
      categories: { slug: { $eq: gender } },
    },
    populate: BESTSELLING_POPULATE,
    pagination: { limit: 8 },
  };

  const response: StrapiResponse<Product> = await fetchStaticData(
    "/products",
    query,
    ["bestselling-products"]
  );

  return { products: response.data };
}

/**
 * Fetch featured products (optimized for static)
 */

export async function fetchFeaturedProducts(): Promise<{
  products: Product[];
}> {
  const query = {
    filters: {
      featured: {
        $eq: true,
      },
    },
    populate: FEATURED_POPULATE,
    pagination: { limit: 4 },
  };

  const response: StrapiResponse<Product> = await fetchStaticData(
    "/products",
    query,
    ["featured-products"]
  );

  return { products: response.data };
}

// Slug-only fetchers used by generateStaticParams

export async function fetchAllProductSlugs(): Promise<string[]> {
  const query = {
    fields: ["slug"],
    pagination: { limit: 1000, start: 0 },
  };
  try {
    const response: StrapiResponse<Pick<Product, "slug">> = await fetchData(
      "/products",
      query,
      { tags: ["products-base"], revalidate: 3600 }
    );
    return response.data.map((p) => p.slug);
  } catch {
    return [];
  }
}

export async function fetchAllCategorySlugs(): Promise<string[]> {
  const query = {
    fields: ["slug"],
    pagination: { limit: 100, start: 0 },
  };
  try {
    const response: StrapiResponse<Pick<Category, "slug">> = await fetchData(
      "/categories",
      query,
      { tags: ["categories"], revalidate: 7200 }
    );
    return response.data.map((c) => c.slug);
  } catch {
    return [];
  }
}

export async function fetchAllFaceSlugs(): Promise<string[]> {
  const query = {
    fields: ["slug"],
    pagination: { limit: 100, start: 0 },
  };
  try {
    const response: StrapiResponse<Pick<Face, "slug">> = await fetchData(
      "/faces",
      query,
      { tags: ["faces"], revalidate: 7200 }
    );
    return response.data.map((f) => f.slug);
  } catch {
    return [];
  }
}
