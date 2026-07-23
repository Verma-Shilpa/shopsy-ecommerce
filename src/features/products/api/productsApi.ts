import type { Product, ProductsResponse } from "@/types/product";

const PRODUCTS_API_ROUTE = "/api/products";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  try {
    const response = await fetch(url, { signal });

    if (!response.ok) {
      const responseMessage = await getResponseErrorMessage(response);

      throw new ApiError(
        responseMessage ??
          `Products API returned ${response.status} ${response.statusText || "error"}.`,
        response.status,
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (
      error instanceof ApiError ||
      (error instanceof DOMException && error.name === "AbortError")
    ) {
      throw error;
    }

    throw new ApiError(
      "Network request failed. Check your connection and try again.",
    );
  }
}

async function getResponseErrorMessage(
  response: Response,
): Promise<string | null> {
  try {
    const res = await response.json();
    return typeof res.message === "string" ? res.message : null;
  } catch {
    return null;
  }
}

export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  const data = await fetchJson<ProductsResponse>(
    `${PRODUCTS_API_ROUTE}?limit=100`,
    signal,
  );
  return data.products;
}

export async function fetchProductById(
  id: number,
  signal?: AbortSignal,
): Promise<Product> {
  return fetchJson<Product>(`${PRODUCTS_API_ROUTE}/${id}`, signal);
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof DOMException && error.name === "AbortError") {
    return "Request cancelled.";
  }

  if (error instanceof ApiError) {
    return error.message;
  }

  return "Something went wrong while loading products.";
}
