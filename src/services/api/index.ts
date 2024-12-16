import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface DashboardData {
  stats: {
    patients: number
    appointments: number
    revenue: number
    compareToPrevious: {
      patients: number
      appointments: number
      revenue: number
    }
  }
  patients: Array<{
    id: number
    name: string
    avatar: string
    appointmentTime: string
    isCompleted: boolean
  }>
}

interface Reminder {
  id: number
  title: string
  name: string
  type: 'paciente' | 'médico' | 'hospital'
  date: string
  description: string
}

interface AuthData {
  user: {
    name: string
    avatarUrl: string
  }
  isAuthenticated: boolean
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001' }),
  endpoints: () => ({}),
})

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAuth: builder.query<AuthData, void>({
      query: () => '/auth',
    }),
  }),
})

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query<DashboardData, Date>({
      query: (date) => `/dashboard?date=${date.toISOString().split('T')[0]}`,
    }),
  }),
})

export const remindersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReminders: builder.query<Reminder[], void>({
      query: () => '/reminders',
    }),
  }),
})

export const { useGetAuthQuery } = authApi
export const { useGetDashboardDataQuery } = dashboardApi
export const { useGetRemindersQuery } = remindersApi
