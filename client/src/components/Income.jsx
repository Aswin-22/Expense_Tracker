import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTransactions, deleteTransaction } from "../redux/transactionSlice";

const Income = () => {
  const dispatch = useDispatch();

  const { incomeTransactions, status, error } = useSelector(
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
    formData.append("type", "INCOME")
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
        <input
          type="text"
          name="name"
        />
        <label htmlFor="amount">Amount</label>
        <input
          type="text"
          name="amount"
        />
        <label htmlFor="date"></label>
        <input
          type="date"
          name="date"
        />
        {error && (
          <p style={{ color: "red" }}>
            {typeof error === "string" ? error : error.message}
          </p>
        )}

        <button type="submit">Add Transaction</button>
      </form>

      <div className="transaction-container">
        {status === "loading" && <p>Loading transactions...</p>}
        {status === "failed" && <p>Error: {error}</p>}
        <h1>All Transactions</h1>
        {incomeTransactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <ul>
            {incomeTransactions.map((transaction) => (
              <li key={transaction._id}>
                <strong>{transaction.name}</strong> - ₹{transaction.amount} (
                {transaction.type})
                <button onClick={() => handleDelete(transaction._id)}>Delete transaction</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Income;
