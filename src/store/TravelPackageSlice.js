import { createSlice } from '@reduxjs/toolkit'

const travelPackageDataSlice = createSlice({
  name: 'travelPackageData',
  initialState: [],
  reducers: {
    replaceTravelPackageData(state, action) {
      state = action.payload
      return state
    }
  }
})

export default travelPackageDataSlice.reducer

export const { replaceTravelPackageData } = travelPackageDataSlice.actions
