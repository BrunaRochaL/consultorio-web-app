import { AppointmentFormData } from '@/components/Scheduling/AppointmentModal/AppointmentModal'

import { TagTypes, baseApi } from './baseApi'

export interface TimeSlot {
  id: number
  time: string
  available: boolean
  doctorId: number
  patient?: {
    id: number
    name: string
    phone?: string
  }
}

export interface Appointment extends AppointmentFormData {
  id: string
  createdAt: string
  status: 'AGENDADO' | 'CANCELADO' | 'CONCLUIDO'
  date: string
  time: string
  doctorId: number
  timeSlotId: number
}

export const appointmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAppointment: builder.mutation<
      Appointment,
      Partial<AppointmentFormData> & {
        timeSlotId: number
        doctorId: number
        date: string
        time: string
      }
    >({
      query: (appointment) => ({
        url: '/appointments',
        method: 'POST',
        body: {
          ...appointment,
          createdAt: new Date().toISOString(),
          status: 'AGENDADO',
        },
      }),
      invalidatesTags: () => ['Appointments', 'TimeSlots'],
    }),
    updateAppointment: builder.mutation<
      Appointment,
      { id: string } & Partial<AppointmentFormData> & {
          timeSlotId: number
          doctorId: number
          date: string
          time: string
        }
    >({
      query: ({ id, ...appointment }) => ({
        url: `/appointments/${id}`,
        method: 'PUT',
        body: {
          ...appointment,
        },
      }),
      invalidatesTags: () => ['Appointments', 'TimeSlots'],
    }),
    deleteAppointment: builder.mutation<void, string>({
      query: (id) => ({
        url: `/appointments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => ['Appointments', 'TimeSlots'],
    }),
    getAppointments: builder.query<
      Appointment[],
      | Date
      | {
          date: string
          doctorId?: number
          search?: string
          time?: string
          cpf?: string
          status?: 'AGENDADO' | 'CANCELADO' | 'CONCLUIDO'
        }
    >({
      query: (params) => {
        if (params instanceof Date) {
          return `/appointments?date=${params.toISOString().split('T')[0]}`
        }
        const { date, doctorId, search, time, cpf, status } = params
        const queryParams = new URLSearchParams()

        queryParams.append('date', date)
        if (doctorId) {
          queryParams.append('doctorId', doctorId.toString())
        }
        if (search) {
          queryParams.append('personalData.fullName', search)
        }
        if (time) {
          queryParams.append('time', time)
        }
        if (cpf) {
          queryParams.append('personalData.cpf', cpf)
        }
        if (status) {
          queryParams.append('status', status)
        }

        return `/appointments?${queryParams.toString()}`
      },
      providesTags: ['Appointments'],
    }),
    getTimeSlots: builder.query<TimeSlot[], { date: string; doctorId: number }>(
      {
        async queryFn(arg, _queryApi, _extraOptions, fetchWithBQ) {
          try {
            const timeSlotsResult = await fetchWithBQ(
              `/timeSlots?doctorId=${arg.doctorId}`
            )
            if (timeSlotsResult.error) return { error: timeSlotsResult.error }
            const timeSlots = timeSlotsResult.data as TimeSlot[]

            const appointmentsResult = await fetchWithBQ(
              `/appointments?date=${arg.date}&doctorId=${arg.doctorId}&status=AGENDADO`
            )
            if (appointmentsResult.error)
              return { error: appointmentsResult.error }
            const appointments = appointmentsResult.data as Appointment[]

            const updatedTimeSlots = timeSlots.map((slot) => {
              const appointment = appointments.find(
                (app) => app.time === slot.time
              )

              if (appointment) {
                return {
                  ...slot,
                  available: false,
                  patient: {
                    id: 0,
                    name: appointment.personalData.fullName,
                    phone: appointment.personalData.phone,
                  },
                }
              }

              return {
                ...slot,
                available: true,
                patient: undefined,
              }
            })

            return { data: updatedTimeSlots }
          } catch (error) {
            console.error('Erro ao buscar horários:', error)
            return { error: error as Error }
          }
        },
        providesTags: ['TimeSlots'],
      }
    ),
  }),
  overrideExisting: false,
})

export const {
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
  useGetAppointmentsQuery,
  useGetTimeSlotsQuery,
} = appointmentsApi
