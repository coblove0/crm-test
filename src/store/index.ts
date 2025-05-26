import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import clientsReducer from './clientsSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    clients: clientsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
