import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/Types/product";

interface ProductState {
  adminProducts: Product[];
}

const initialState: ProductState = {
  adminProducts: [],
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addAdminProduct(state, action: PayloadAction<Product>) {
      state.adminProducts = [action.payload, ...state.adminProducts];
    },
    resetAdminProducts(state) {
      state.adminProducts = [];
    },
  },
});

export const { addAdminProduct, resetAdminProducts } = productSlice.actions;
export default productSlice.reducer;