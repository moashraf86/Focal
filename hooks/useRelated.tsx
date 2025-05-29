import { Product, StrapiResponse } from "@/lib/definitions";
import qs from "qs";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  // simulate a delay for testing purposes
  await new Promise((resolve) => setTimeout(resolve, 500));

  const response: StrapiResponse<Product> = await res.json();

  if (!response.data) {
    throw new Error("No data found");
  }

  const products = response.data;

  return products;
};

export function useRelatedProducts({
  cat,
  face = "",
}: {
  cat: string;
  face?: string;
}) {
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
  const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/products?${query}`;
  const { data, error, isLoading } = useSWR<Product[]>(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  return {
    products: data ?? [],
    isLoading,
    isError: error,
  };
}
