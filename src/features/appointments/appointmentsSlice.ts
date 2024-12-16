import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface Appointment {
  id: string
  date: string
  patientName: string
  status: 'scheduled' | 'completed' | 'cancelled'
}

interface AppointmentsState {
  items: Appointment[]
  loading: boolean
  error: string | null
}

const initialState: AppointmentsState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async (date: Date) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return [] as Appointment[]
  }
)

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Erro ao carregar consultas'
      })
  },
})

export default appointmentsSlice.reducer
