import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { Client } from '../types';

const clientsSlice = createSlice({
  name: 'clients',
  initialState: [] as Client[],
  reducers: {
    addClient(state, action: PayloadAction<Omit<Client, 'id'>>) {
      const maxId = state.reduce((max, c) => (c.id > max ? c.id : max), 0);
      state.push({ id: maxId + 1, ...action.payload });
    },
    updateClient(state, action: PayloadAction<Client>) {
      const index = state.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteClient(state, action: PayloadAction<number>) {
      return state.filter(c => c.id !== action.payload);
    },
  },
});

export const { addClient, updateClient, deleteClient } = clientsSlice.actions;
export default clientsSlice.reducer;