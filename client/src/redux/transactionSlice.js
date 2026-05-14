import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

/* ================= FETCH ================= */
export const fetchAndSetTransactions = createAsyncThunk(
  "transactions/fetchAndSetTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/transactions", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

/* ================= ADD ================= */
export const addTransactions = createAsyncThunk(
  "transactions/addTransactions",
  async (transactionData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/api/transactions",
        transactionData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

/* ================= DELETE ================= */
export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/transactions/${id}`, {
        withCredentials: true,
      });
      return { _id: id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

/* ================= UTILS ================= */
const calculateTotals = (transactions) => {
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((tx) => {
    const amount = Number(tx.amount);

    if (tx.type === "INCOME") totalIncome += amount;
    else totalExpense += amount;
  });

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  };
};

/* ================= SLICE ================= */
const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    allTransactions: [],
    incomeTransactions: [],
    expenseTransactions: [],
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    status: "idle",
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* FETCH */
      .addCase(fetchAndSetTransactions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAndSetTransactions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allTransactions = action.payload;

        state.incomeTransactions = action.payload.filter(
          (t) => t.type === "INCOME"
        );
        state.expenseTransactions = action.payload.filter(
          (t) => t.type === "EXPENSE"
        );

        const totals = calculateTotals(action.payload);
        Object.assign(state, totals);
      })
      .addCase(fetchAndSetTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      /* ADD */
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

        const totals = calculateTotals(state.allTransactions);
        Object.assign(state, totals);
      })
      .addCase(addTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      /* DELETE */
      .addCase(deleteTransaction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.status = "succeeded";
        const deletedId = action.payload._id;

        state.allTransactions = state.allTransactions.filter(
          (t) => t._id !== deletedId
        );
        state.incomeTransactions = state.incomeTransactions.filter(
          (t) => t._id !== deletedId
        );
        state.expenseTransactions = state.expenseTransactions.filter(
          (t) => t._id !== deletedId
        );

        const totals = calculateTotals(state.allTransactions);
        Object.assign(state, totals);
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearError } = transactionSlice.actions;
export default transactionSlice.reducer;