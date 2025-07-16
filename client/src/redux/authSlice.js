import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:3000/user/auth", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/user/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Login failed" });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    error: null,
    isAuthenticated: false,
    loading: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
