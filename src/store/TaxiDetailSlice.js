import { createSlice } from '@reduxjs/toolkit'

const taxiDetailSlice = createSlice({
  name: 'taxiDetailSlice',
  initialState: null,
  reducers: {
    replaceTravelPackageData(state, action) {
      state = action.payload
      return state
    }
  }
})

export default taxiDetailSlice.reducer

export const { replaceTravelPackageData } = taxiDetailSlice.actions
