import { configureStore } from '@reduxjs/toolkit'
import templateSlice from './reduxFeatures/templateslice'

export const templateStore = () => {
  return configureStore({
    reducer: {
        userTemplate: templateSlice.reducer
    }
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof templateStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']