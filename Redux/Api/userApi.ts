// RTK Query slice for auth against the existing Express backend
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  AuthResponse,
  GetMeResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from "@/Types/user";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    login: builder.mutation<User, LoginPayload>({
      query: (body) => ({
        url: `/users/login`,
        method: "POST",
        body,
      }),
      transformResponse: (res: AuthResponse) => res.user,
    }),
    register: builder.mutation<User, RegisterPayload>({
      query: (body) => ({
        url: `/users/register`,
        method: "POST",
        body,
      }),
      transformResponse: (res: AuthResponse) => res.user,
    }),
    getMe: builder.query<User, void>({
      query: () => `/users/me`,
      transformResponse: (res: GetMeResponse) => res.user,
    }),
    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: `/users/logout`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useLogoutMutation,
} = userApi;