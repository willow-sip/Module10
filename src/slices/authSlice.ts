import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '@/data/datatypes';

export interface AuthState {
  user: User | null;
  userAuth: boolean;
  authMode: string | null;
}

const initialState: AuthState = {
  user: null,
  userAuth: false,
  authMode: null,
};

function getTokenExpiration(token: string): number | null {
  const parts: string[] = token.split('.');
  if(parts.length === 3){
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload.exp ? payload.exp * 1000 : null;
  }
  return null;
}

export const signUp = createAsyncThunk(
  'auth/signup',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Signup failed');
    return true;
  }
);

export const signIn = createAsyncThunk(
  'auth/signin',
  async ({ email, password }: { email: string; password: string },
    { dispatch }) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error('Login failed');

    const data = await response.json();
    const exp = getTokenExpiration(data.token);
    if (!exp) throw new Error('Invalid token');

    localStorage.setItem('currentUser', JSON.stringify(data.user));
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('expiresAt', exp.toString());

    dispatch(setAuth({ user: data.user }));

    return true;
  }
);

export const logOut = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('expiresAt');
    localStorage.removeItem('authToken');
    dispatch(clearAuth());
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<{ user: User }>) {
      state.user = action.payload.user;
      state.userAuth = true;
    },
    clearAuth(state) {
      state.user = null;
      state.userAuth = false;
      state.authMode = null;
    },
    updateAuthMode(state, action: PayloadAction<string | null>) {
      state.authMode = action.payload;
    },
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        Object.assign(state.user, action.payload);
      }
    },
  },
});

export const { setAuth, clearAuth, updateAuthMode, updateUser } = authSlice.actions;
export default authSlice.reducer;



