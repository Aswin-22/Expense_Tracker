import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTransactions } from "../redux/transactionSlice";

const Income = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const { incomeTransactions, status, error } = useSelector(
    (state) => state.transactions
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const transactionData = {
        name,
        amount: Number(amount),
        date: date || new Date(),
        type: "INCOME",
      };
      await dispatch(addTransactions(transactionData)).unwrap();
      setName("");
      setAmount("");
      setDate("");
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
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="amount">Amount</label>
        <input
          type="text"
          name="amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <label htmlFor="date"></label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
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
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Income;
