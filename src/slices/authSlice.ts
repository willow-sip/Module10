import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '@/data/datatypes';

interface AuthState {
  user: User | null;
  userAuth: boolean;
  authMode: string | null;
  token: string | null;
  expiresAt: number | null;
}

const initialState: AuthState = {
    user: null,
  userAuth: false,
  authMode: null,
  token: null,
  expiresAt: null,
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

    dispatch(setAuth({
      user: data.user,
      token: data.token,
      expiresAt: exp,
    }));

    return true;
  }
);

export const logOut = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('expiresAt');
    dispatch(clearAuth());
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<{ user: User; token: string; expiresAt: number }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.userAuth = true;
      state.expiresAt = action.payload.expiresAt;
    },
    clearAuth(state) {
      state.user = null;
      state.token = null;
      state.userAuth = false;
      state.authMode = null;
      state.expiresAt = null;
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



