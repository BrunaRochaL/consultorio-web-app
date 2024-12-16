import { Appointment } from './appointments'
import { baseApi } from './baseApi'
import { DayData } from '@/types/dashboard'

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query<DayData, Date>({
      async queryFn(date, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          const appointmentsResult = await fetchWithBQ('/appointments')
          if (appointmentsResult.error)
            return { error: appointmentsResult.error }
          const appointments = appointmentsResult.data as Appointment[]

          const selectedDate = date.toISOString().split('T')[0]
          const previousDate = new Date(date)
          previousDate.setDate(previousDate.getDate() - 1)
          const previousDateStr = previousDate.toISOString().split('T')[0]

          const todayAppointments = appointments.filter(
            (app) => app.date === selectedDate && app.status === 'AGENDADO'
          )
          const previousDayAppointments = appointments.filter(
            (app) => app.date === previousDateStr && app.status === 'AGENDADO'
          )

          const uniquePatients = new Set(
            todayAppointments.map((app) => app.personalData.cpf)
          ).size
          const totalAppointments = todayAppointments.length
          const totalRevenue = todayAppointments.reduce(
            (sum, app) => sum + Number(app.payment.value),
            0
          )

          const previousUniquePatients = new Set(
            previousDayAppointments.map((app) => app.personalData.cpf)
          ).size
          const previousTotalAppointments = previousDayAppointments.length
          const previousTotalRevenue = previousDayAppointments.reduce(
            (sum, app) => sum + Number(app.payment.value),
            0
          )

          const patients = todayAppointments.map((app) => ({
            id: parseInt(app.id, 16), // Converte o id string para número
            name: app.personalData.fullName,
            avatar: '/images/default-avatar.png',
            appointmentTime: app.time,
            isCompleted: app.status === 'CONCLUIDO',
          }))

          const data: DayData = {
            stats: {
              patients: uniquePatients,
              appointments: totalAppointments,
              revenue: totalRevenue,
              compareToPrevious: {
                patients: uniquePatients - previousUniquePatients,
                appointments: totalAppointments - previousTotalAppointments,
                revenue: totalRevenue - previousTotalRevenue,
              },
            },
            patients: patients.sort((a, b) =>
              a.appointmentTime.localeCompare(b.appointmentTime)
            ),
          }

          return { data }
        } catch (error) {
          return { error: error as any }
        }
      },
      providesTags: ['Dashboard', 'Appointments'],
    }),
  }),
})

export const { useGetDashboardDataQuery } = dashboardApi
