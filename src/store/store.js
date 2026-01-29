import { configureStore } from '@reduxjs/toolkit';
import userReducer from "./userSlice.js";
import classReducer from "./classSlice.js";

const store = configureStore({
  reducer: {
    user: userReducer,
    class: classReducer,        
  },
});

export default store;
