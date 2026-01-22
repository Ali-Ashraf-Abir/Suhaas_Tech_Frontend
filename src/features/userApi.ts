import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../services/baseQuery";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query<any, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => ({
        url: "/user",
        params: { page, limit },
      }),
      providesTags: ["Users"],
    }),

    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/user/${id}/role`,
        method: "POST",
        body: { role },
      }),
      invalidatesTags: ["Users"],
    }),

    updateUserStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/user/${id}/status`,
        method: "POST",
        body: { status },
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useUpdateUserStatusMutation,
} = userApi;
