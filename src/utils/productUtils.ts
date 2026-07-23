import type { Product } from "@/types/product";

export type ProductFilters = {
  query: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  minRating: string;
};

export type ProductSort = "featured" | "price-asc" | "price-desc" | "rating-desc" | "discount-desc" | "title-asc";

export const defaultFilters: ProductFilters = {
  query: "",
  category: "all",
  minPrice: "",
  maxPrice: "",
  minRating: ""
};

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  }).format(value);
}

export function getDiscountedPrice(product: Product): number {
  return product.price * (1 - product.discountPercentage / 100);
}

export function getCategoryLabel(category: string): string {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getUniqueCategories(products: Product[]): string[] {
  return Array.from(new Set(products.map((product) => product.category))).sort((a, b) => a.localeCompare(b));
}

export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  const query = filters.query.trim().toLowerCase();
  const minPrice = Number(filters.minPrice);
  const maxPrice = Number(filters.maxPrice);
  const minRating = Number(filters.minRating);

  return products.filter((product) => {
    const searchable = `${product.title} ${product.description} ${product.category} ${product.brand ?? ""} ${product.tags.join(" ")}`.toLowerCase();
    const matchesQuery = !query || searchable.includes(query);
    const matchesCategory = filters.category === "all" || product.category === filters.category;
    const matchesMinPrice = !filters.minPrice || product.price >= minPrice;
    const matchesMaxPrice = !filters.maxPrice || product.price <= maxPrice;
    const matchesRating = !filters.minRating || product.rating >= minRating;

    return matchesQuery && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesRating;
  });
}

export function sortProducts(products: Product[], sort: ProductSort): Product[] {
  const sorted = [...products];

  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => getDiscountedPrice(a) - getDiscountedPrice(b));
    case "price-desc":
      return sorted.sort((a, b) => getDiscountedPrice(b) - getDiscountedPrice(a));
    case "rating-desc":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "discount-desc":
      return sorted.sort((a, b) => b.discountPercentage - a.discountPercentage);
    case "title-asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "featured":
    default:
      return sorted.sort((a, b) => b.rating * b.stock - a.rating * a.stock);
  }
}
