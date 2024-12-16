import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'

export type TagTypes = 'Auth' | 'Dashboard' | 'Appointments' | 'TimeSlots'

const baseQueryWithDelay: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:3001',
    prepareHeaders: (headers) => {
      return headers
    },
  })

  const url = typeof args === 'string' ? args : args?.url
  if (url && !url.includes('auth')) {
    await new Promise((resolve) => setTimeout(resolve, 0))
  }

  return baseQuery(args, api, extraOptions)
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithDelay,
  tagTypes: ['Auth', 'Dashboard', 'Appointments', 'TimeSlots'],
  endpoints: () => ({}),
})

export const endpoints = baseApi.endpoints
