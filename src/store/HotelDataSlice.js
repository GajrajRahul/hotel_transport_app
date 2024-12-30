import { createSlice } from '@reduxjs/toolkit'

const hotelDataSlice = createSlice({
  name: 'hotelData',
  initialState: null,
  reducers: {
    replaceHotelData(state, action) {
      state = action.payload
      return state
    }
  }
})

export default hotelDataSlice.reducer

export const { replaceHotelData } = hotelDataSlice.actions
