import { AuthState } from '@/features/auth/authSlice'

import { baseApi } from './baseApi'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAuth: builder.query<AuthState, void>({
      query: () => '/auth',
      providesTags: ['Auth'],
    }),
  }),
})

export const { useGetAuthQuery } = authApi
