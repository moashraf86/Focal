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
  const response: StrapiResponse<Product> = await res.json();

  //simulate a delay for loading state
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!response.data) {
    throw new Error("No data found");
  }

  const products = response.data;

  return products;
};

export function useBestsellingProducts(gender: string) {
  const query = qs.stringify({
    filters: {
      collections: { slug: { $eq: "bestselling" } },
      categories: { slug: { $eq: gender } },
    },
    populate: {
      categories: {
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
          },
        },
      },
    },
  });
  const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/products?${query}`;
  const { data, error, isLoading } = useSWR<Product[]>(url, fetcher);

  return {
    products: data ?? [],
    isLoading,
    isError: error,
  };
}
