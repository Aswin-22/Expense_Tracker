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

export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/transactions/${id}`, {
        withCredentials: true,
      });
      return {_id: id};
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
      })
      .addCase(deleteTransaction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.status = "succeeded";
        const deletedId = action.payload._id;
        state.allTransactions = state.allTransactions.filter(
          (transaction) => transaction._id !== deletedId
        );
        state.incomeTransactions = state.incomeTransactions.filter(
          (transaction) => transaction._id !== deletedId
        );
        state.expenseTransactions = state.expenseTransactions.filter(
          (transaction) => transaction._id !== deletedId
        );
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default transactionSlice.reducer;
