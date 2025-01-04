import { createSlice } from '@reduxjs/toolkit'

const monumentDataSlice = createSlice({
  name: 'monumentData',
  initialState: [],
  reducers: {
    replaceMonumentData(state, action) {
      state = action.payload
      return state
    }
  }
})

export default monumentDataSlice.reducer

export const { replaceMonumentData } = monumentDataSlice.actions
