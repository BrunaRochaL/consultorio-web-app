import { Appointment } from '@/services/api/appointments'

interface AppointmentStats {
  patients: number
  appointments: number
  revenue: number
  compareToPrevious: {
    patients: number
    appointments: number
    revenue: number
  }
}

export const useAppointmentsStats = (
  appointments: Appointment[] | undefined,
  previousAppointments: Appointment[] | undefined
): AppointmentStats => {
  if (!appointments) {
    return {
      patients: 0,
      appointments: 0,
      revenue: 0,
      compareToPrevious: {
        patients: 0,
        appointments: 0,
        revenue: 0,
      },
    }
  }

  const uniquePatients = new Set(
    appointments.map((apt: Appointment) => apt.personalData.cpf)
  ).size

  const previousUniquePatients = new Set(
    previousAppointments?.map((apt: Appointment) => apt.personalData.cpf) || []
  ).size

  const revenue = appointments.reduce(
    (sum: number, apt: Appointment) => sum + Number(apt.payment.value),
    0
  )

  const previousRevenue =
    previousAppointments?.reduce(
      (sum: number, apt: Appointment) => sum + Number(apt.payment.value),
      0
    ) || 0

  return {
    patients: uniquePatients,
    appointments: appointments.length,
    revenue: revenue,
    compareToPrevious: {
      patients: uniquePatients - previousUniquePatients,
      appointments: appointments.length - (previousAppointments?.length || 0),
      revenue: revenue - previousRevenue,
    },
  }
}
