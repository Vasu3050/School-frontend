import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from "./userSlice.js";

const persistConfig = {
  key: "user",
  storage,
  whitelist: [
    "name",
    "phone",
    "email",
    "roles",
    "role",
    "status",
    "accessToken",
    "refreshToken",
    "isAuthenticated"
  ],
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);

const store = configureStore({
  reducer: {
    user: persistedUserReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

export const persistor = persistStore(store);

export default store;