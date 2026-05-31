import { useSelector, useDispatch } from "react-redux";
import { fetchAndSetTransactions } from "../redux/transactionSlice";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    allTransactions,
    status,
    error,
    totalExpense,
    totalIncome,
    balance,
  } = useSelector((state) => state.transactions);

  useEffect(() => {
    if (user) {
      dispatch(fetchAndSetTransactions());
    }
  }, [dispatch, user]);

  if (status === "loading") {
    return <div className="loading-state"><p>Loading...</p></div>;
  }

  if (status === "failed") {
    return <div className="empty-state"><p>Error: {error}</p></div>;
  }

  const recentTransactions = allTransactions.slice(0, 5);

  return (
    <div className="page-wrapper">

      {/* Welcome */}
      <div style={{ marginBottom: "var(--space-8)" }}>
        <h2>Welcome back, {user?.name} 👋</h2>
        <p className="text-muted">Here's your financial snapshot.</p>
      </div>

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

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex justify-between items-center"
          style={{ marginBottom: "var(--space-6)" }}>
          <h3>Recent Transactions</h3>
          <Link to="/transactions" className="text-sm font-medium"
            style={{ color: "var(--color-primary)" }}>
            View all →
          </Link>
        </div>

        {allTransactions.length === 0 ? (
          <div className="empty-state">
            <p>No transactions yet.</p>
            <Link to="/transactions" className="btn btn-primary"
              style={{ marginTop: "var(--space-4)" }}>
              Add your first transaction
            </Link>
          </div>
        ) : (
          <ul className="transaction-list">
            {recentTransactions.map((transaction) => (
              <li key={transaction._id} className="transaction-item">
                <div className="transaction-info">
                  <span className="font-medium">{transaction.name}</span>
                  <span className={`badge ${transaction.type === "INCOME"
                    ? "badge-income" : "badge-expense"}`}>
                    {transaction.type}
                  </span>
                </div>
                <div className="transaction-right">
                  <span className={`font-semibold ${transaction.type === "INCOME"
                    ? "text-success" : "text-danger"}`}>
                    ₹{transaction.amount}
                  </span>
                  <span className="text-sm text-muted">
                    {new Date(transaction.date).toLocaleDateString("en-IN")}
                  </span>
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