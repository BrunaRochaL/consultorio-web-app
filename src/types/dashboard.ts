export interface Patient {
  id: number
  name: string
  avatar: string
  appointmentTime: string
  isCompleted: boolean
}

export interface DailyStats {
  patients: number
  appointments: number
  revenue: number
  compareToPrevious: {
    patients: number
    appointments: number
    revenue: number
  }
}

export interface DayData {
  stats: DailyStats
  patients: Patient[]
}
