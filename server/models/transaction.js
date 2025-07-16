const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    type: { type: String, enum: ["INCOME", "EXPENSE"], required: true },
    name: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
