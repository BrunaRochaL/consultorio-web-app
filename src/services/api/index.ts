import { baseApi } from './baseApi'

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

interface Doctor {
  id: number
  name: string
  avatar: string
  specialty: string
  available: boolean
}

interface TimeSlot {
  id: number
  time: string
  available: boolean
}

export { baseApi }

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

export const doctorsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDoctors: builder.query<Doctor[], void>({
      query: () => '/doctors',
    }),
  }),
})

export const timeSlotsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTimeSlots: builder.query<TimeSlot[], { doctorId: number; date: string }>(
      {
        query: ({ doctorId, date }) =>
          `/timeSlots?doctorId=${doctorId}&date=${date}`,
      }
    ),
  }),
})

export const { useGetAuthQuery } = authApi
export const { useGetDashboardDataQuery } = dashboardApi
export const { useGetRemindersQuery } = remindersApi
export const { useGetDoctorsQuery } = doctorsApi
export const { useGetTimeSlotsQuery } = timeSlotsApi
