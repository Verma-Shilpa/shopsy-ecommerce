import type { Product, ProductsResponse } from "@/types/product";

const DEFAULT_PRODUCTS_LIMIT = 100;
const MIN_PRODUCTS_LIMIT = 1;
const MAX_PRODUCTS_LIMIT = 100;

export class ProductsError extends Error {
  constructor(
    message: string,
    public readonly status = 500,
  ) {
    super(message);
    this.name = "ProductsError";
  }
}

function getProductsEndpoint(): string {
  const productsApiUrl = process.env.PRODUCTS_API_URL;

  if (!productsApiUrl) {
    throw new ProductsError("Products API endpoint is not configured.", 500);
  }

  return productsApiUrl.replace(/\/$/, "");
}

function normalizeLimit(limit: number): number {
  if (!Number.isFinite(limit)) {
    return DEFAULT_PRODUCTS_LIMIT;
  }

  const roundedLimit = Math.trunc(limit);

  if (roundedLimit < MIN_PRODUCTS_LIMIT) {
    return MIN_PRODUCTS_LIMIT;
  }

  if (roundedLimit > MAX_PRODUCTS_LIMIT) {
    return MAX_PRODUCTS_LIMIT;
  }

  return roundedLimit;
}

async function requestSourceJson<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      throw new ProductsError(
        `Products API returned ${response.status} ${response.statusText || "error"}.`,
        response.status,
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ProductsError) {
      throw error;
    }

    throw new ProductsError(
      "Network request failed. Check your connection and try again.",
    );
  }
}

export async function fetchProductsFromSource(
  limit: number,
): Promise<ProductsResponse> {
  const productLimit = normalizeLimit(limit);
  return requestSourceJson<ProductsResponse>(
    `${getProductsEndpoint()}?limit=${productLimit}`,
  );
}

export async function fetchProductByIdFromSource(id: number): Promise<Product> {
  if (id <= 0) {
    throw new ProductsError("Product id is not valid.", 400);
  }

  return requestSourceJson<Product>(`${getProductsEndpoint()}/${id}`);
}

export function getProductsRouteError(error: unknown): {
  message: string;
  status: number;
} {
  if (error instanceof ProductsError) {
    return { message: error.message, status: error.status };
  }

  return {
    message: "Something went wrong while loading products.",
    status: 500,
  };
}
