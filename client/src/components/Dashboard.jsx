import { useSelector, useDispatch } from "react-redux";
import {
  addTransactions,
  deleteTransaction,
  fetchAndSetTransactions,
  clearError,
} from "../redux/transactionSlice";
import { useEffect } from "react";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const {
    allTransactions,
    status,
    error,
    totalExpense,
    totalIncome,
    balance,
  } = useSelector((state) => state.transactions);

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchAndSetTransactions());
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

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

  if (status === "loading") return <p className="loading-state">Loading transactions...</p>;
  if (status === "failed") return <p className="empty-state">Error: {error}</p>;

  return (
    <div className="page-wrapper">

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="card summary-card">
          <p className="text-muted text-sm">Total Income</p>
          <h3 className="text-success">₹{totalIncome}</h3>
        </div>
        <div className="card summary-card">
          <p className="text-muted text-sm">Total Expense</p>
          <h3 className="text-danger">₹{totalExpense}</h3>
        </div>
        <div className="card summary-card">
          <p className="text-muted text-sm">Balance</p>
          <h3 className={balance >= 0 ? "text-success" : "text-danger"}>
            ₹{balance}
          </h3>
        </div>
      </div>

      {/* Add Transaction Form */}
      <div className="card" style={{ marginBottom: "var(--space-8)" }}>
        <h3 style={{ marginBottom: "var(--space-6)" }}>Add Transaction</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input id="name" type="text" name="name" placeholder="e.g. Lunch, Salary" />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount (₹)</label>
            <input id="amount" type="number" name="amount" placeholder="0.00" min="0" />
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
          <button type="submit" className="btn btn-primary">
            Add Transaction
          </button>
        </form>
      </div>

      {/* Transaction List */}
      <div className="card">
        <h3 style={{ marginBottom: "var(--space-6)" }}>All Transactions</h3>
        {allTransactions.length === 0 ? (
          <div className="empty-state">
            <p>No transactions yet. Add one above.</p>
          </div>
        ) : (
          <ul className="transaction-list">
            {allTransactions.map((transaction) => (
              <li key={transaction._id} className="transaction-item">
                <div className="transaction-info">
                  <span className="font-medium">{transaction.name}</span>
                  <span
                    className={`badge ${
                      transaction.type === "INCOME"
                        ? "badge-income"
                        : "badge-expense"
                    }`}
                  >
                    {transaction.type}
                  </span>
                </div>
                <div className="transaction-right">
                  <span
                    className={`font-semibold ${
                      transaction.type === "INCOME"
                        ? "text-success"
                        : "text-danger"
                    }`}
                  >
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

export default Dashboard;