import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Client } from '../types';

const initialState: Client[] = [
  { id: 1, name: 'Иван Иванов', email: 'ivanov@mail.ru', phone: '+7 999 123-45-67' },
  { id: 2, name: 'Мария Петрова', email: 'petrova@mail.ru', phone: '+7 912 222-33-44' },
  { id: 3, name: 'John Doe', email: 'john.doe@example.com', phone: '+7 900 555-66-77' },
];

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
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