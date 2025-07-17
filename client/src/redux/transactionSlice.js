import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

export const fetchAndSetTransactions = createAsyncThunk(
  "transactions/fetchAndSetTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/transactions", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addTransactions = createAsyncThunk(
  "transactions/addTransactions",
  async (transactionData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/transactions",
        transactionData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    allTransactions: [],
    incomeTransactions: [],
    expenseTransactions: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAndSetTransactions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAndSetTransactions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allTransactions = action.payload;
        state.incomeTransactions = action.payload.filter(
          (transaction) => transaction.type === "INCOME"
        );
        state.expenseTransactions = action.payload.filter(
          (transaction) => transaction.type === "EXPENSE"
        );
      })
      .addCase(fetchAndSetTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addTransactions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addTransactions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allTransactions.push(action.payload);
        if (action.payload.type === "INCOME") {
          state.incomeTransactions.push(action.payload);
        } else {
          state.expenseTransactions.push(action.payload);
        }
      })
      .addCase(addTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default transactionSlice.reducer;
