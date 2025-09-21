// pendingUsersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getPendingUsers } from "../api/authApi.js";

export const fetchPendingUsers = createAsyncThunk(
  "pendingUsers/fetch",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await getPendingUsers(payload);
      return res.data.pendingUsers; // important!
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const pendingUsersSlice = createSlice({
  name: "pendingUsers",
  initialState: {
    list: [],       // will hold pendingUsers[]
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPendingUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default pendingUsersSlice.reducer;
