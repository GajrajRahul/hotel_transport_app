import { createSlice } from '@reduxjs/toolkit'

const userDataSlice = createSlice({
  name: 'userData',
  initialState: [],
  reducers: {
    replaceUserData(state, action) {
      state = action.payload
      return state
    }
  }
})

export default userDataSlice.reducer

export const { replaceUserData } = userDataSlice.actions
