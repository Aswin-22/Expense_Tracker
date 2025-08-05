import Transaction from "../models/transaction.js";

export async function handleNewTransaction(req, res, next) {
  const { amount, date, type, name } = req.body;

  try {
    const newTransaction = await Transaction.create({
      userId: req.user._id,
      amount,
      date: date || new Date(),
      type,
      name,
    });

    res.status(201).json(newTransaction);
  } catch (error) {
    const err = new Error("Error registering transaction" + error.message);
    err.statusCode = 400;
    next(err);
  }
}

export async function getAllTransactions(req, res, next) {
  try {
    const transactions = await Transaction.find({ userId: req.user._id });
    if (!transactions) {
      const err = new Error("No transactions found");
      err.statusCode = 404;
      throw err;
    }
    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
}

export async function deleteTransaction(req, res, next) {
  const { id } = req.params;

  try {
    const transaction = await Transaction.findByIdAndDelete(id);
    if (!transaction) {
      const err = new Error("No transactions found");
      err.statusCode = 404;
      throw err;
    }
    res.status(200).json({ message: "Transaction deleted successfully", _id: id });
  } catch (error) {
    next(error);
  }
}

