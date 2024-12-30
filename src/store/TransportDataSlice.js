import { createSlice } from '@reduxjs/toolkit'

const transportDataSlice = createSlice({
  name: 'transportData',
  initialState: null,
  reducers: {
    replaceTransportData(state, action) {
      state = action.payload
      return state
    }
  }
})

export default transportDataSlice.reducer

export const { replaceTransportData } = transportDataSlice.actions
