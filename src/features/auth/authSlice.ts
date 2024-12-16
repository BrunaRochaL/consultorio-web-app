import { createSlice } from '@reduxjs/toolkit'

import { baseApi } from '@/services/api'

export interface User {
  name: string
  avatarUrl: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      baseApi.endpoints.getAuth.matchFulfilled,
      (state, { payload }) => {
        state.user = payload.user
        state.isAuthenticated = payload.isAuthenticated
      }
    )
  },
})

export const { setUser, logout } = authSlice.actions
export default authSlice.reducer
