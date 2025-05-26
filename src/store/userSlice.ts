import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Role = 'guest' | 'user' | 'admin';

interface UserState {
  role: Role;
}

const initialState: UserState = {
  role: 'guest',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setRole(state, action: PayloadAction<Role>) {
      state.role = action.payload;
    },
  },
});

export const { setRole } = userSlice.actions;
export default userSlice.reducer;