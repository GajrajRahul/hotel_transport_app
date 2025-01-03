import { configureStore, combineReducers, createAsyncThunk } from '@reduxjs/toolkit'

import BreadCrumbsSlice from './BreadCrumbsSlice'
import TravelInfoSlice from './quotations/TravelInfoSlice'
import HotelsInfoSlice from './quotations/HotelsInfoSlice'
import HotelDataSlice from './HotelDataSlice'
import TransportDataSlice from './TransportDataSlice'
import TravelPackageSlice from './TravelPackageSlice'

const reducers = combineReducers({
  breadcrumb: BreadCrumbsSlice,
  travelInfo: TravelInfoSlice,
  hotelsInfo: HotelsInfoSlice,
  hotelRateData: HotelDataSlice,
  transportRateData: TransportDataSlice,
  travelPackageData: TravelPackageSlice
})

const reducerProxy = (state, action) => {
  //   if (action.type === 'logout/LOGOUT') {
  //     return reducers(undefined, action)
  //   }
  return reducers(state, action)
}

const store = configureStore({
  reducer: reducerProxy,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export default store
