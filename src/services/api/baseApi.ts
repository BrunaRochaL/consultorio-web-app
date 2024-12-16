import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'

export const TagTypes = {
  Appointments: 'Appointments',
  TimeSlots: 'TimeSlots',
  Doctors: 'Doctors',
} as const

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
  tagTypes: Object.values(TagTypes),
  endpoints: () => ({}),
})

export const endpoints = baseApi.endpoints
