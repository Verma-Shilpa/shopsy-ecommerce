"use client";

import { FormEvent, useEffect } from "react";
import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { StatusPanel } from "@/components/ui/StatusPanel";
import { saveProductPreferences } from "@/features/products/productPreferencesStorage";
import { selectCategories, selectFilteredProducts, selectProductStats } from "@/features/products/productsSelectors";
import {
  applyRecentSearch,
  commitSearch,
  loadProducts,
  resetFilters,
  selectProductsState,
  setCategory,
  setMaxPrice,
  setMinPrice,
  setMinRating,
  setQuery,
  setSort
} from "@/features/products/productsSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { getCategoryLabel, type ProductSort } from "@/utils/productUtils";
import { ProductGrid } from "./ProductGrid";
import { ProductSkeleton } from "./ProductSkeleton";

const sortOptions: Array<{ value: ProductSort; label: string }> = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating-desc", label: "Top rated" },
  { value: "discount-desc", label: "Biggest discount" },
  { value: "title-asc", label: "Name: A to Z" }
];

export function ProductsPage() {
  const dispatch = useAppDispatch();
  const { filters, sort, status, error, recentSearches, preferencesHydrated } = useAppSelector(selectProductsState);
  const products = useAppSelector(selectFilteredProducts);
  const categories = useAppSelector(selectCategories);
  const stats = useAppSelector(selectProductStats);
  const hasPriceConflict = Boolean(filters.minPrice && filters.maxPrice && Number(filters.minPrice) > Number(filters.maxPrice));

  useEffect(() => {
    if (status === "idle") {
      dispatch(loadProducts());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (preferencesHydrated) {
      saveProductPreferences({ filters, sort, recentSearches });
    }
  }, [filters, preferencesHydrated, recentSearches, sort]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch(commitSearch());
  }

  return (
    <section className="products-page">
      <div className="products-hero">
        <div>
          <span className="eyebrow">DummyJSON catalog</span>
          <h1>Browse products with search, filters, and sorting.</h1>
        </div>
        <div className="catalog-stats" aria-label="Catalog statistics">
          <span>
            <strong>{stats.visible}</strong>
            shown
          </span>
          <span>
            <strong>{stats.total}</strong>
            total
          </span>
        </div>
      </div>

      <section className="toolbar" aria-label="Product search and filters">
        <form className="search-row" onSubmit={handleSearch}>
          <label className="visually-hidden" htmlFor="product-search">
            Search products
          </label>
          <div className="search-input">
            <Search size={19} aria-hidden="true" />
            <input
              id="product-search"
              type="search"
              placeholder="Search by product, brand, category, or tag"
              value={filters.query}
              onChange={(event) => dispatch(setQuery(event.target.value))}
            />
          </div>
          <button className="primary-button" type="submit" aria-label="Apply search">
            <Search size={17} aria-hidden="true" />
            Search
          </button>
        </form>

        {recentSearches.length ? (
          <div className="recent-searches" aria-label="Recent searches">
            <span>Recent</span>
            {recentSearches.map((query) => (
              <button type="button" key={query} onClick={() => dispatch(applyRecentSearch(query))}>
                {query}
              </button>
            ))}
          </div>
        ) : null}

        <div className="filter-grid">
          <label className="control">
            <span>Category</span>
            <select value={filters.category} onChange={(event) => dispatch(setCategory(event.target.value))}>
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option value={category} key={category}>
                  {getCategoryLabel(category)}
                </option>
              ))}
            </select>
          </label>

          <label className="control">
            <span>Min price</span>
            <input
              type="number"
              min="0"
              step="1"
              placeholder="$0"
              value={filters.minPrice}
              onChange={(event) => dispatch(setMinPrice(event.target.value))}
            />
          </label>

          <label className="control">
            <span>Max price</span>
            <input
              type="number"
              min="0"
              step="1"
              placeholder={stats.highestPrice ? `$${Math.ceil(stats.highestPrice)}` : "$0"}
              value={filters.maxPrice}
              onChange={(event) => dispatch(setMaxPrice(event.target.value))}
            />
          </label>

          <label className="control">
            <span>Rating</span>
            <select value={filters.minRating} onChange={(event) => dispatch(setMinRating(event.target.value))}>
              <option value="">Any rating</option>
              <option value="4.5">4.5 and above</option>
              <option value="4">4.0 and above</option>
              <option value="3.5">3.5 and above</option>
            </select>
          </label>

          <label className="control">
            <span>Sort by</span>
            <select value={sort} onChange={(event) => dispatch(setSort(event.target.value as ProductSort))}>
              {sortOptions.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <button className="secondary-button filter-reset" type="button" onClick={() => dispatch(resetFilters())}>
            <RotateCcw size={17} aria-hidden="true" />
            Reset
          </button>
        </div>

        {hasPriceConflict ? (
          <p className="filter-warning">
            <SlidersHorizontal size={16} aria-hidden="true" />
            Minimum price is higher than maximum price.
          </p>
        ) : null}
      </section>

      {status === "loading" || status === "idle" ? <ProductSkeleton /> : null}

      {status === "failed" ? (
        <StatusPanel
          title="Products could not be loaded"
          message={error ?? "The product API is not responding right now."}
          actionLabel="Retry"
          onAction={() => dispatch(loadProducts())}
          tone="error"
        />
      ) : null}

      {status === "succeeded" && products.length > 0 ? <ProductGrid products={products} /> : null}

      {status === "succeeded" && products.length === 0 ? (
        <StatusPanel
          title="No products match"
          message="Try a different keyword, category, price range, or rating."
          actionLabel="Clear filters"
          onAction={() => dispatch(resetFilters())}
          tone="empty"
        />
      ) : null}
    </section>
  );
}
