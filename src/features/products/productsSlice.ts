import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  fetchProducts,
  getApiErrorMessage,
} from "@/features/products/api/productsApi";
import type { ProductPreferences } from "@/features/products/productPreferencesStorage";
import type { RootState } from "@/store/store";
import type { Product } from "@/types/product";
import {
  defaultFilters,
  type ProductFilters,
  type ProductSort,
} from "@/utils/productUtils";

type ProductsState = {
  items: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  filters: ProductFilters;
  sort: ProductSort;
  preferencesRestored: boolean;
};

const initialState: ProductsState = {
  items: [],
  status: "idle",
  error: null,
  filters: defaultFilters,
  sort: "featured",
  preferencesRestored: false,
};

export const loadProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("products/loadProducts", async (_res, { signal, rejectWithValue }) => {
  try {
    return await fetchProducts(signal);
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    restoreProductPreferences(
      state,
      action: PayloadAction<ProductPreferences>,
    ) {
      state.filters = action.payload.filters;
      state.sort = action.payload.sort;
      state.preferencesRestored = true;
    },
    setQuery(state, action: PayloadAction<string>) {
      state.filters.query = action.payload;
    },
    setCategory(state, action: PayloadAction<string>) {
      state.filters.category = action.payload;
    },
    setMinPrice(state, action: PayloadAction<string>) {
      state.filters.minPrice = action.payload;
    },
    setMaxPrice(state, action: PayloadAction<string>) {
      state.filters.maxPrice = action.payload;
    },
    setMinRating(state, action: PayloadAction<string>) {
      state.filters.minRating = action.payload;
    },
    setSort(state, action: PayloadAction<ProductSort>) {
      state.sort = action.payload;
    },
    resetFilters(state) {
      state.filters = defaultFilters;
      state.sort = "featured";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unable to load products.";
      });
  },
});

export const {
  restoreProductPreferences,
  setQuery,
  setCategory,
  setMinPrice,
  setMaxPrice,
  setMinRating,
  setSort,
  resetFilters,
} = productsSlice.actions;

export const selectProductsState = (state: RootState) => state.products;
export default productsSlice.reducer;
