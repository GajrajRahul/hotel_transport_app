import { createSlice } from '@reduxjs/toolkit'
import addDays from 'date-fns/addDays'

const travelInfoSlice = createSlice({
  name: 'travelInfo',
  initialState: {
    name: '',
    dates: [new Date(), addDays(new Date(), 45)],
    'days-nights': '45 Days & 44 Nights'
  },
  reducers: {
    updateTravelInfo(state, action) {
      state = action.payload
      return state
    }
  }
})

export default travelInfoSlice.reducer

export const { updateTravelInfo } = travelInfoSlice.actions
