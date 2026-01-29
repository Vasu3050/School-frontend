import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as classApi from "../api/classApi.js";

export const fetchClasses = createAsyncThunk(
  "classes/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await classApi.getAllClasses();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createNewClass = createAsyncThunk(
  "classes/create",
  async (payload, { rejectWithValue }) => {
    try {
      return await classApi.createClass(payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateClass = createAsyncThunk(
  "classes/update",
  async ({ classId, data }, { rejectWithValue }) => {
    try {
      return await classApi.updateClass({ classId, formData: data });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const classSlice = createSlice({
  name: "classes",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchClasses.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload;
      })
      .addCase(fetchClasses.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      .addCase(createNewClass.fulfilled, (s, a) => {
        s.list.unshift(a.payload);
      })
      .addCase(updateClass.fulfilled, (s, a) => {
        const i = s.list.findIndex(c => c._id === a.payload._id);
        if (i !== -1) s.list[i] = a.payload;
      });
  },
});

export default classSlice.reducer;
