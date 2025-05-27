import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import clientsReducer from './clientsSlice';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

export const createTestStore = () =>
  configureStore({
    reducer: {
      user: userReducer,
      clients: clientsReducer,
    },
  });

export const renderWithProvider = (ui: React.ReactElement) => {
  const testStore = createTestStore(); // Новый store для каждого теста!
  return render(<Provider store={testStore}>{ui}</Provider>);
};