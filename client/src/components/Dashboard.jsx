import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTransactions, deleteTransaction } from "../redux/transactionSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("");

  const { allTransactions, status, error } = useSelector(
    (state) => state.transactions
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!type || (type !== "INCOME" && type !== "EXPENSE")) {
      alert("Please select a valid transaction type.");
      return;
    }

    try {
      const transactionData = {
        name,
        amount: Number(amount),
        date: date || new Date(),
        type,
      };
      await dispatch(addTransactions(transactionData)).unwrap();
      setName("");
      setAmount("");
      setDate("");
      setType("");
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
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="amount">Amount</label>
        <input
          type="number"
          name="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <label htmlFor="date"></label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <select
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
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
