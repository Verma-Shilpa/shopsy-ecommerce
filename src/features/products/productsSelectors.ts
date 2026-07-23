import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";
import { filterProducts, getUniqueCategories, sortProducts } from "@/utils/productUtils";

const selectProducts = (state: RootState) => state.products.items;
const selectFilters = (state: RootState) => state.products.filters;
const selectSort = (state: RootState) => state.products.sort;

export const selectCategories = createSelector([selectProducts], getUniqueCategories);

export const selectFilteredProducts = createSelector([selectProducts, selectFilters, selectSort], (products, filters, sort) =>
  sortProducts(filterProducts(products, filters), sort)
);

export const selectProductStats = createSelector([selectProducts, selectFilteredProducts], (products, filteredProducts) => ({
  total: products.length,
  visible: filteredProducts.length,
  highestPrice: products.reduce((max, product) => Math.max(max, product.price), 0)
}));
