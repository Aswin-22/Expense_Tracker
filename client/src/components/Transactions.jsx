import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addTransactions,
  deleteTransaction,
  clearError,
} from "../redux/transactionSlice";
import { useEffect } from "react";

const Transactions = () => {
  const dispatch = useDispatch();
  const { allTransactions, status, error } = useSelector(
    (state) => state.transactions
  );

  const [filter, setFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("date-desc");

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Filter then sort — derived from Redux state, no extra fetch needed
  const displayedTransactions = useMemo(() => {
    let result = [...allTransactions];

    // Filter
    if (filter !== "ALL") {
      result = result.filter((t) => t.type === filter);
    }

    // Sort
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
  }, [allTransactions, filter, sortBy]);

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
            <select id="type" name="type" defaultValue="">
              <option disabled value="">Select Type</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
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

        {/* List Header — filter and sort controls */}
        <div className="transaction-list-header">
          <h3>All Transactions</h3>
          <div className="transaction-controls">

            {/* Filter buttons */}
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

            {/* Sort dropdown */}
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

        {/* Results count */}
        <p className="text-sm text-muted" style={{ marginBottom: "var(--space-4)" }}>
          {displayedTransactions.length} transaction
          {displayedTransactions.length !== 1 ? "s" : ""}
        </p>

        {/* List */}
        {status === "loading" ? (
          <div className="loading-state"><p>Loading...</p></div>
        ) : displayedTransactions.length === 0 ? (
          <div className="empty-state">
            <p>
              {filter === "ALL"
                ? "No transactions yet. Add one above."
                : `No ${filter.toLowerCase()} transactions found.`}
            </p>
          </div>
        ) : (
          <ul className="transaction-list">
            {displayedTransactions.map((transaction) => (
              <li key={transaction._id} className="transaction-item">
                <div className="transaction-info">
                  <span className="font-medium">{transaction.name}</span>
                  <span className={`badge ${transaction.type === "INCOME"
                    ? "badge-income" : "badge-expense"}`}>
                    {transaction.type}
                  </span>
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
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Transactions;