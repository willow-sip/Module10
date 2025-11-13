import { store } from '@/store';
import { setAuth, clearAuth } from '@/slices/authSlice';
import { User } from '@/data/datatypes';

export const restoreAuth = () => {
  const savedUser = localStorage.getItem('currentUser');
  const savedToken = localStorage.getItem('authToken');
  const savedExp = localStorage.getItem('expiresAt');

  if (savedUser && savedToken && savedExp) {
    const exp = parseInt(savedExp, 10);
    if (Date.now() < exp) {
      const user: User = JSON.parse(savedUser);
      store.dispatch(setAuth({ user, token: savedToken, expiresAt: exp }));
    } else {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
      localStorage.removeItem('expiresAt');
      store.dispatch(clearAuth());
    }
  }
};