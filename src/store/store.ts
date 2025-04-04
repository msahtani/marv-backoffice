import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counterSlice';
import authReducer from './slices/authSlice';
import touristReducer from './slices/touristSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    tourists: touristReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 