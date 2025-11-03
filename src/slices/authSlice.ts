import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  expiresAt: number | null;
}

const initialState: AuthState = {
  expiresAt: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setExpiresAt: (state, action: PayloadAction<number>) => {
      state.expiresAt = action.payload;
    },
    clearExpiresAt: (state) => {
      state.expiresAt = null;
    },
  },
});

export const { setExpiresAt, clearExpiresAt } = authSlice.actions;
export default authSlice.reducer;
