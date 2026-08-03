// RTK Query slice for products against the existing Express backend
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Product, ProductResponse } from "@/Types/product";

interface QueryArgs {
  q?: string;
  page?: number;
  limit?: number;
  category?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: "include",
  }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], QueryArgs | void>({
      query: (args) => {
        const { q, page = 1, limit = 200, category } = args || {};
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(limit));
        if (q) params.set("q", q);
        if (category) params.set("category", category);
        return `/products/all?${params.toString()}`;
      },
      transformResponse: (res: ProductResponse) =>
        res.success ? res.data.map(normalize) : [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Product" as const, id })),
              { type: "Product", id: "LIST" as const },
            ]
          : [{ type: "Product", id: "LIST" as const }],
    }),
    getProductById: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      transformResponse: (res: { success: boolean; data: Product }) =>
        normalize(res.data),
      providesTags: (_res, _err, id) => [{ type: "Product", id }],
    }),
    getCategories: builder.query<string[], void>({
      query: () => `/products/categories`,
      transformResponse: (res: { success: boolean; data: string[] }) =>
        res.data,
    }),
    getProductsByCategory: builder.query<Product[], string>({
      query: (category) => `/products/category?category=${category}`,
      transformResponse: (res: { success: boolean; data: Product[] }) =>
        res.data.map(normalize),
    }),
    addProduct: builder.mutation<Product, Product>({
      query: (product) => ({
        url: `/products/post`,
        method: "POST",
        body: {
          name: product.name || product.title,
          price: String(product.price),
          description: product.description,
          image: product.image || "",
          category: product.category,
        },
      }),
      transformResponse: (res: { success: boolean; data: Product }) =>
        normalize(res.data),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
  }),
});

const normalize = (p: Product): Product => ({
  ...p,
  id: p._id ?? p.id,
  title: p.name ?? p.title,
  image: p.image || "",
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetCategoriesQuery,
  useGetProductsByCategoryQuery,
  useAddProductMutation,
} = productApi;