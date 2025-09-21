import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  phone: '',
  email: '',
  roles: [],
  role: '', // Current selected role
  status: '',
  accessToken: '',
  refreshToken: '',
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { name, phone, email, roles, role, status, accessToken, refreshToken } = action.payload;
      state.name = name;
      state.phone = phone;
      state.email = email;
      state.roles = roles;
      state.role = role;
      state.status = status;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
    },
    refreshToken: (state, action) => {
      const { accessToken, refreshToken } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
    },
    logout: (state) => {
      // Reset to initial state
      Object.assign(state, initialState);
    },
    clearUser: (state) => {
      // Same as logout for backward compatibility
      Object.assign(state, initialState);
    },
  },
});

export const { setUser, refreshToken, logout, clearUser } = userSlice.actions;
export default userSlice.reducer;