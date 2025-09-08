import axios from "axios";
import store from "../store/store";
import { refreshToken as refreshTokenAction } from "../store/userSlice.js";

// create an axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// interceptor to handle automatic refresh token on 401
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // only retry once per request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // call refresh endpoint with current refreshToken from Redux
        const { data } = await API.patch("/users/refresh-token", {
          refreshToken: store.getState().user.refreshToken,
        });

        // update Redux with new tokens
        store.dispatch(
          refreshTokenAction({
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken,
          })
        );

        // retry original request
        return API(originalRequest);
      } catch (refreshErr) {
        // refresh token invalid, you might want to logout user here
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
