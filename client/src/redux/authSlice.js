import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user/auth", {
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
      const response = await axiosInstance.post(
        "/user/login",
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
      return rejectWithValue(
        error.response?.data || { message: "Login failed" }
      );
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/user/logout", {}, { withCredentials: true });
      return;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Logout failed" }
      );
    }
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user/signup", formData, {
        withCredentials: true,
      });
      return response.data.message;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Signup failed. Please try again."
      );
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
  reducers: {},
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
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
      })
      .addCase(signup.fulfilled, (state) => {
        state.error = null;
        state.loading = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
        state.loading = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default authSlice.reducer;
