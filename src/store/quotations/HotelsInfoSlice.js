import { createSlice } from '@reduxjs/toolkit'

const hotelsInfoSlice = createSlice({
  name: 'hotelsInfo',
  initialState: [],
  reducers: {
    addCities(state, action) {
      state.push(action.payload)
    },
    updateCity(state, action) {},
    deleteCity(state, action) {
      return state.filter(city => city.id != action.payload.id)
    }
  }
})

export default hotelsInfoSlice.reducer

export const { addCities, updateCity, deleteCity } = hotelsInfoSlice.actions
