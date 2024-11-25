import { configureStore, combineReducers, createAsyncThunk } from '@reduxjs/toolkit'

import BreadCrumbsSlice from './BreadCrumbsSlice'

const reducers = combineReducers({
  breadcrumb: BreadCrumbsSlice
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
