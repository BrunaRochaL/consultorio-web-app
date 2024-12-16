import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQueryWithDelay = async (args: any, api: any, extraOptions: any) => {
  const baseQuery = fetchBaseQuery({ baseUrl: 'http://localhost:3001' })

  const url = typeof args === 'string' ? args : args?.url
  if (url && !url.includes('auth')) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  return baseQuery(args, api, extraOptions)
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithDelay,
  endpoints: () => ({}),
  tagTypes: ['Auth', 'Dashboard'],
})

export const endpoints = baseApi.endpoints
