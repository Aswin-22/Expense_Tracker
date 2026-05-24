import { useSelector, useDispatch } from "react-redux";
import { addTransactions, deleteTransaction } from "../redux/transactionSlice";

const Expense = () => {
  const dispatch = useDispatch();

  const { expenseTransactions, status, error } = useSelector(
    (state) => state.transactions
  );

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteTransaction(id)).unwrap();
    } catch (err) {
      console.error("Failed to delete transaction:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("type", "EXPENSE");
    try {
      await dispatch(addTransactions(formData)).unwrap();
      e.target.reset();
    } catch (err) {
      console.error("Failed to add transaction:", err);
    }
  };

  return (
    <div className="page-wrapper">

      {/* Add Expense Form */}
      <div className="card" style={{ marginBottom: "var(--space-8)" }}>
        <h3 style={{ marginBottom: "var(--space-6)" }}>Add Expense</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input id="name" type="text" name="name" placeholder="e.g. Lunch, Rent" />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount (₹)</label>
            <input id="amount" type="number" name="amount" placeholder="0.00" min="0" />
          </div>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input id="date" type="date" name="date" />
          </div>
          {error && (
            <p className="form-error">
              {typeof error === "string" ? error : error.message}
            </p>
          )}
          <button type="submit" className="btn btn-primary">
            Add Expense
          </button>
        </form>
      </div>

      {/* Expense List */}
      <div className="card">
        <h3 style={{ marginBottom: "var(--space-6)" }}>All Expenses</h3>
        {status === "loading" && <p className="loading-state">Loading...</p>}
        {expenseTransactions.length === 0 ? (
          <div className="empty-state">
            <p>No expense transactions yet. Add one above.</p>
          </div>
        ) : (
          <ul className="transaction-list">
            {expenseTransactions.map((transaction) => (
              <li key={transaction._id} className="transaction-item">
                <div className="transaction-info">
                  <span className="font-medium">{transaction.name}</span>
                  <span className="badge badge-expense">EXPENSE</span>
                </div>
                <div className="transaction-right">
                  <span className="font-semibold text-danger">
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

export default Expense;