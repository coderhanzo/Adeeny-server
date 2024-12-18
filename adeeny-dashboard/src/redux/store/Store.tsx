import { configureStore, applyMiddleware} from "@reduxjs/toolkit";
import authReducer from "../slice/authSlice"
import mosqueSlice from "../slice/mosqueSlice";
import waqfSlice from "../slice/waqfSlice"

const rootReducer = {
  auth: authReducer,
  mosque:mosqueSlice,
  waqf:waqfSlice,
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  
});

export type RootState = ReturnType<typeof store.getState>;


export type AppDispatch = typeof store.dispatch;