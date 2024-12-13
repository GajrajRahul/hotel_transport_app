import { createSlice } from '@reduxjs/toolkit'

const transportInfoSlice = createSlice({
  name: 'transportInfo',
  initialState: [],
  reducers: {
    updateTransportInfo(state, action) {
      state = action.payload
      return state
    }
  }
})

export default transportInfoSlice.reducer

export const { updateTransportInfo } = transportInfoSlice.actions
