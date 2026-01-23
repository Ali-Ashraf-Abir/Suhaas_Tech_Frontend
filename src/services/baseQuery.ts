import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../app/store';
import { RefreshResponse } from '../types/auth.types';
import { logout, setCredentials } from '../features/auth/authSlice';


const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Custom base query with automatic token refresh
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  const isAuthEndpoint =
    typeof args === 'object' &&
    (args.url === '/auth/login' || args.url === '/auth/refresh');

  if (result.error?.status === 401 && !isAuthEndpoint) {
    console.log('Access token expired, attempting refresh...');

    const refreshResult = await baseQuery(
      { url: '/auth/refresh', method: 'POST' },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const data = refreshResult.data as RefreshResponse;

      api.dispatch(
        setCredentials({
          accessToken: data.data.accessToken,
        })
      );

      // retry original request
      return baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());

    }
  }

  return result;
};
