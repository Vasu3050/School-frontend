import { configureStore } from '@reduxjs/toolkit';
import userReducer form "../features/userSlice.js";

const store = configureStore({
  reducer: {
    // user: userReducer,
        
  },
});

export default store;
