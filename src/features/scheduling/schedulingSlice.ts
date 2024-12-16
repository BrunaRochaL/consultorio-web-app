import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface SchedulingState {
  loading: boolean
  error: string | null
  success: boolean
}

const initialState: SchedulingState = {
  loading: false,
  error: null,
  success: false,
}

export const createAppointment = createAsyncThunk(
  'scheduling/createAppointment',
  async (date: Date) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return true
  }
)

const schedulingSlice = createSlice({
  name: 'scheduling',
  initialState,
  reducers: {
    resetScheduling: (state) => {
      state.success = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAppointment.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(createAppointment.fulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Erro ao agendar consulta'
      })
  },
})

export const { resetScheduling } = schedulingSlice.actions
export default schedulingSlice.reducer
