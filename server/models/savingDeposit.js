const mongoose = require("mongoose");
const { Schema } = mongoose;

const savingDepositSchema = new Schema(
  {
    savingId: { type: Schema.Types.ObjectId, ref: "Saving", required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const SavingDeposit = mongoose.model("SavingDeposit", savingDepositSchema);

module.exports = SavingDeposit;
