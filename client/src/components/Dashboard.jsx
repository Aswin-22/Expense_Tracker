import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTransactions, deleteTransaction } from "../redux/transactionSlice";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { allTransactions, status, error, totalExpense, totalIncome, balance } = useSelector(
    (state) => state.transactions
  );

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
  }

  if (status === "loading") return <p>Loading transactions...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="password">Name</label>
        <input
          type="text"
          name="name"
        />
        <label htmlFor="amount">Amount</label>
        <input
          type="number"
          name="amount"
        />
        <label htmlFor="date"></label>
        <input
          type="date"
          name="date"
        />
        <select
          name="type"
        >
          <option disabled value="">
            Select Type
          </option>
          <option value="INCOME">INCOME</option>
          <option value="EXPENSE">EXPENSE</option>
        </select>
        {error && (
          <p style={{ color: "red" }}>
            {typeof error === "string" ? error : error.message}
          </p>
        )}

        <button type="submit">Add Transaction</button>
      </form>

      <div className="transaction-container">
        <h3>Total Income: {totalIncome}</h3>
        <h3>Total Expense: {totalExpense}</h3>
        <h3>Balance: {balance}</h3>
        <h1>All Transactions</h1>
        {allTransactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <ul>
            {allTransactions.map((transaction) => (
              <li key={transaction._id}>
                <strong>{transaction.name}</strong> - ₹{transaction.amount} (
                {transaction.type})
                <button onClick={() => handleDelete(transaction._id)}>Delete Transaction</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
