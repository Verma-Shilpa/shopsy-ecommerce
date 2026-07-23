import { readJson, writeJson } from "@/utils/browserStorage";
import { defaultFilters, type ProductFilters, type ProductSort } from "@/utils/productUtils";

export type ProductPreferences = {
  filters: ProductFilters;
  sort: ProductSort;
  recentSearches: string[];
};

const PRODUCT_PREFERENCES_STORAGE_KEY = "shopsy:product-preferences";

const defaultPreferences: ProductPreferences = {
  filters: defaultFilters,
  sort: "featured",
  recentSearches: []
};

export function readProductPreferences(): ProductPreferences {
  const preferences = readJson<Partial<ProductPreferences>>(PRODUCT_PREFERENCES_STORAGE_KEY);

  return {
    filters: {
      ...defaultPreferences.filters,
      ...preferences?.filters
    },
    sort: preferences?.sort ?? defaultPreferences.sort,
    recentSearches: preferences?.recentSearches ?? defaultPreferences.recentSearches
  };
}

export function saveProductPreferences(preferences: ProductPreferences): void {
  writeJson(PRODUCT_PREFERENCES_STORAGE_KEY, preferences);
}
