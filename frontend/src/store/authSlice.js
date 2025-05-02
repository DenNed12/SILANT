import { createSlice } from '@reduxjs/toolkit';
import api from '../api/api';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
  },
  reducers: {
    loginSuccess(state, action) {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export const login = (username, password) => async dispatch => {
  try {
    const response = await api.post('/token/', { username, password });
    localStorage.setItem('access_token', response.data.access);
    const userResponse = await api.get('/user/me/');
    dispatch(loginSuccess({ user: userResponse.data }));
  } catch (error) {
    console.error('Login failed:', error);
  }
};

export default authSlice.reducer;