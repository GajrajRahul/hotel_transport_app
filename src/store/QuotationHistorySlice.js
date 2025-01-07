import { createSlice } from '@reduxjs/toolkit'

const quotationHistorySlice = createSlice({
  name: 'quotationHistoryData',
  initialState: null,
  reducers: {
    replaceQuotationHistoryData(state, action) {
      state = action.payload
      return state
    }
  }
})

export default quotationHistorySlice.reducer

export const { replaceQuotationHistoryData } = quotationHistorySlice.actions
