import { createSlice } from '@reduxjs/toolkit'

const breadcrumbSlice = createSlice({
  name: 'breadcrumb',
  initialState: [
    {
      label: 'Dashboard',
      color: 'text.primary'
    }
  ],
  reducers: {
    replaceBreadcrumbs(state, action) {
      state = action.payload
      return state
    }
  }
})

export default breadcrumbSlice.reducer

export const { replaceBreadcrumbs } = breadcrumbSlice.actions
