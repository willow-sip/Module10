import { restoreAuth } from '@/slices/restoreAuth';
import * as authSlice from '@/slices/authSlice';
import { store } from '@/store';
import { User } from '@/data/datatypes';
import { localStorageMock } from './basic_mocks/localStorageMock';

const mockDispatch = jest.fn();
store.dispatch = mockDispatch;

const mockUser: User = {
  id: 0,
  username: 'admin',
  email: 'admin@mail.ru',
  password: '12345',
};

describe('basic tests for restoreAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  it('if token not expired, keep userAuth data and state', () => {
    const notExpired = Date.now() + 90000000;
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    localStorage.setItem('authToken', 'cool.jwt.token');
    localStorage.setItem('expiresAt', notExpired.toString());
    restoreAuth();

    expect(mockDispatch).toHaveBeenCalledWith(authSlice.setAuth({ user: mockUser }));
    expect(mockDispatch).not.toHaveBeenCalledWith(authSlice.clearAuth(expect.anything()));
    expect(localStorage.removeItem).not.toHaveBeenCalled();
  });

  it('if token is expired, clear userAuth data and state', () => {
    const expired = Date.now() - 90000000;
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    localStorage.setItem('authToken', 'bad.jwt.token');
    localStorage.setItem('expiresAt', expired.toString());
    restoreAuth();

    expect(mockDispatch).toHaveBeenCalledWith(authSlice.clearAuth());
    expect(localStorage.removeItem).toHaveBeenCalledWith('currentUser');
    expect(localStorage.removeItem).toHaveBeenCalledWith('authToken');
    expect(localStorage.removeItem).toHaveBeenCalledWith('expiresAt');
    expect(mockDispatch).not.toHaveBeenCalledWith(authSlice.setAuth(expect.anything()));
  });
});