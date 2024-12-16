import { baseApi } from './baseApi'
import { DayData } from '@/types/dashboard'

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query<DayData, Date>({
      query: (date) => {
        const formattedDate = date.toISOString().split('T')[0]
        return {
          url: '/dashboard',
          params: { date: formattedDate },
        }
      },
      transformResponse: (response: Record<string, DayData>) => {
        const dayData = Object.values(response)[0]
        return dayData
      },
      providesTags: ['Dashboard'],
    }),
  }),
})

export const { useGetDashboardDataQuery } = dashboardApi
