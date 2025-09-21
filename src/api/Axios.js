import axios from "axios";
import store from "../store/store";
import { refreshToken as refreshTokenAction, logout } from "../store/userSlice.js";

// create an axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Add request interceptor to include auth token
API.interceptors.request.use(
  (config) => {
    const token = store.getState().user.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// interceptor to handle automatic refresh token on 401
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't try to refresh token for login, register, or refresh endpoints
    const excludedEndpoints = ['/users/login', '/users/register', '/users/admin-register', '/users/refresh-token'];
    const isExcludedEndpoint = excludedEndpoints.some(endpoint => 
      originalRequest.url?.includes(endpoint)
    );

    if (error.response?.status === 401 && !originalRequest._retry && !isExcludedEndpoint) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return API(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = store.getState().user.refreshToken;
        
        if (!refreshToken) {
          // No refresh token available, logout user
          store.dispatch(logout());
          processQueue(error, null);
          return Promise.reject(error);
        }

        // Call refresh endpoint
        const { data } = await axios.post(
          `${API.defaults.baseURL}/users/refresh-token`,
          { refreshToken },
          { withCredentials: true }
        );

        const { accessToken, refreshToken: newRefreshToken } = data.data;

        // Update Redux with new tokens
        store.dispatch(
          refreshTokenAction({
            accessToken,
            refreshToken: newRefreshToken,
          })
        );

        // Update the original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        processQueue(null, accessToken);
        
        // retry original request
        return API(originalRequest);
      } catch (refreshErr) {
        // Refresh token invalid or expired, logout user
        console.error('Token refresh failed:', refreshErr);
        store.dispatch(logout());
        processQueue(refreshErr, null);
        
        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default API;