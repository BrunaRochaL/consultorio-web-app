import { configureStore } from '@reduxjs/toolkit'

import appointmentsReducer from '../features/appointments/appointmentsSlice'
import authReducer from '../features/auth/authSlice'
import schedulingReducer from '../features/scheduling/schedulingSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    appointments: appointmentsReducer,
    scheduling: schedulingReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
