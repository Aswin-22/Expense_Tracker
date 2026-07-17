import { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addTransactions,
  deleteTransaction,
  clearError,
} from "../redux/transactionSlice";
import { fetchCategories } from "../redux/categorySlice";
import DateRangeFilter from "./DateRangeFilter";
import { getCurrentMonthRange, isInRange } from "../utils/dateUtils";

const Transactions = () => {
  const dispatch = useDispatch();

  const { allTransactions, status, error } = useSelector(
    (state) => state.transactions
  );
  const { categories } = useSelector((state) => state.categories);

  const [filter, setFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("date-desc");
  const [dateRange, setDateRange] = useState(getCurrentMonthRange());

  // Track selected type in form so category dropdown can filter by it
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    dispatch(clearError());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Categories filtered by the currently selected type in the form
  const filteredCategories = useMemo(() => {
    if (!selectedType) return [];
    return categories.filter((c) => c.type === selectedType);
  }, [categories, selectedType]);

  const displayedTransactions = useMemo(() => {
    let result = [...allTransactions];

    result = result.filter((t) => isInRange(t.date, dateRange.from, dateRange.to));

    if (filter !== "ALL") {
      result = result.filter((t) => t.type === filter);
    }

    if (sortBy === "date-desc") {
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === "date-asc") {
      result.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === "amount-desc") {
      result.sort((a, b) => b.amount - a.amount);
    } else if (sortBy === "amount-asc") {
      result.sort((a, b) => a.amount - b.amount);
    }

    return result;
  }, [allTransactions, filter, sortBy, dateRange]);

  // Helper to get category name from id
  const getCategoryName = (categoryId) => {
    if (!categoryId) return null;
    const cat = categories.find((c) => c._id === categoryId);
    return cat ? cat.name : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const type = formData.get("type");

    if (!type || (type !== "INCOME" && type !== "EXPENSE")) {
      alert("Please select a valid transaction type.");
      return;
    }

    try {
      await dispatch(addTransactions(formData)).unwrap();
      e.target.reset();
      setSelectedType("");
    } catch (err) {
      console.error("Failed to add transaction:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteTransaction(id)).unwrap();
    } catch (err) {
      console.error("Failed to delete transaction:", err);
    }
  };

  return (
    <div className="page-wrapper">

      {/* Add Transaction Form */}
      <div className="card" style={{ marginBottom: "var(--space-8)" }}>
        <h3 style={{ marginBottom: "var(--space-6)" }}>Add Transaction</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="e.g. Lunch, Salary"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount (₹)</label>
            <input
              id="amount"
              type="number"
              name="amount"
              placeholder="0.00"
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input id="date" type="date" name="date" />
          </div>
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <select
              id="type"
              name="type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option disabled value="">Select Type</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              disabled={!selectedType}
            >
              <option value="">
                {selectedType ? "Select Category (optional)" : "Select type first"}
              </option>
              {filteredCategories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          {error && (
            <p className="form-error">
              {typeof error === "string" ? error : error.message}
            </p>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Adding..." : "Add Transaction"}
          </button>
        </form>
      </div>

      {/* Transaction List */}
      <div className="card">
        <DateRangeFilter
          from={dateRange.from}
          to={dateRange.to}
          onChange={setDateRange}
          onReset={() => setDateRange(getCurrentMonthRange())}
        />

        <div className="transaction-list-header">
          <h3>Transactions</h3>
          <div className="transaction-controls">
            <div className="filter-group">
              {["ALL", "INCOME", "EXPENSE"].map((f) => (
                <button
                  key={f}
                  className={`filter-btn ${filter === f ? "active" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f === "ALL" ? "All" : f === "INCOME" ? "Income" : "Expense"}
                </button>
              ))}
            </div>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date-desc">Date — Newest first</option>
              <option value="date-asc">Date — Oldest first</option>
              <option value="amount-desc">Amount — High to low</option>
              <option value="amount-asc">Amount — Low to high</option>
            </select>
          </div>
        </div>

        <p className="text-sm text-muted" style={{ marginBottom: "var(--space-4)" }}>
          {displayedTransactions.length} transaction
          {displayedTransactions.length !== 1 ? "s" : ""}
        </p>

        {status === "loading" ? (
          <div className="loading-state"><p>Loading...</p></div>
        ) : displayedTransactions.length === 0 ? (
          <div className="empty-state">
            <p>
              {filter === "ALL"
                ? "No transactions found for this date range."
                : `No ${filter.toLowerCase()} transactions found for this date range.`}
            </p>
          </div>
        ) : (
          <ul className="transaction-list">
            {displayedTransactions.map((transaction) => {
              const categoryName = getCategoryName(transaction.category);
              return (
                <li key={transaction._id} className="transaction-item">
                  <div className="transaction-info">
                    <span className="font-medium">{transaction.name}</span>
                    <span className={`badge ${transaction.type === "INCOME"
                      ? "badge-income" : "badge-expense"}`}>
                      {transaction.type}
                    </span>
                    {categoryName && (
                      <span className="badge"
                        style={{
                          backgroundColor: "var(--color-primary-light)",
                          color: "var(--color-primary)",
                        }}>
                        {categoryName}
                      </span>
                    )}
                  </div>
                  <div className="transaction-right">
                    <span className="text-sm text-muted">
                      {new Date(transaction.date).toLocaleDateString("en-IN")}
                    </span>
                    <span className={`font-semibold ${transaction.type === "INCOME"
                      ? "text-success" : "text-danger"}`}>
                      ₹{transaction.amount}
                    </span>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(transaction._id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Transactions;