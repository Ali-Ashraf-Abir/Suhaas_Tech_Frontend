import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../services/baseQuery';
import {
  InviteRequest,
  InviteResponse,
  VerifyInviteResponse,
  Invite,
} from '../types/invite.types';

export const inviteAPI = createApi({
  reducerPath: 'inviteAPI',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Invites'],
  endpoints: (builder) => ({
    createInvite: builder.mutation<InviteResponse, InviteRequest>({
      query: (inviteData) => ({
        url: '/invite/user',
        method: 'POST',
        body: inviteData,
      }),
      invalidatesTags: ['Invites'],
    }),
    verifyInvite: builder.query<VerifyInviteResponse, string>({
      query: (token) => ({
        url: `/invite/verify?token=${token}`,
        method: 'POST',
      }),
    }),
    getInvites: builder.query<{ success: boolean; data: Invite[] }, void>({
      query: () => '/invite/list',
      providesTags: ['Invites'],
    }),
  }),
});

export const {
  useCreateInviteMutation,
  useVerifyInviteQuery,
  useLazyVerifyInviteQuery,
  useGetInvitesQuery,
} = inviteAPI;