import { Product, StrapiResponse } from "@/lib/definitions";
import qs from "qs";
import useSWR from "swr";

// Lightweight fetcher with caching headers
const fetcher = async (url: string) => {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
    },
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const response: StrapiResponse<Product> = await res.json();

  if (!response.data) {
    throw new Error("No data found");
  }

  return response.data;
};

export function useRelatedProducts({
  cat,
  face = "",
}: {
  cat: string | string[];
  face?: string;
}) {
  const filters: {
    categories: {
      slug: {
        $in: string[];
      };
    };
    faces?: {
      slug: {
        $eq: string;
      };
    };
  } = {
    categories: {
      slug: {
        $in: Array.isArray(cat) ? cat : [cat],
      },
    },
  };

  if (face && face.trim() !== "") {
    filters.faces = {
      slug: {
        $eq: face,
      },
    };
  }

  // Optimized query with only necessary fields
  const query = qs.stringify({
    filters,
    fields: ["id", "name", "slug", "price"], // Only essential fields
    populate: {
      images: {
        fields: ["url", "formats"], // Remove alternativeText if not used
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
    pagination: { limit: 8 }, // Limit results
  });

  const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/products?${query}`;

  // Use SWR with better caching
  const { data, error, isLoading } = useSWR<Product[]>(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1 minute deduping
    revalidateIfStale: false,
    shouldRetryOnError: false,
    focusThrottleInterval: 300000, // 5 minutes
  });

  return {
    products: data ?? [],
    isLoading,
    isError: error,
  };
}
