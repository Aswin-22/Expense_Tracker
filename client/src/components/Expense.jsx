import { useState } from "react";
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
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input type="text" name="name" />
        <label htmlFor="amount">Amount</label>
        <input type="text" name="amount" />
        <label htmlFor="date"></label>
        <input type="date" name="date" />
        {error && (
          <p style={{ color: "red" }}>
            {typeof error === "string" ? error : error.message}
          </p>
        )}

        <button type="submit">Add Transaction</button>
      </form>
      {status === "loading" && <p>Loading transactions...</p>}
      {status === "failed" && <p>Error: {error}</p>}
      <div className="transaction-container">
        <h1>All Expenses</h1>
        {expenseTransactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <ul>
            {expenseTransactions.map((transaction) => (
              <li key={transaction._id}>
                <strong>{transaction.name}</strong> - ₹{transaction.amount} (
                {transaction.type})
                <button onClick={() => handleDelete(transaction._id)}>
                  Delete transaction
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Expense;
