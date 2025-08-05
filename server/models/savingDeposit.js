import mongoose from "mongoose"

const savingDepositSchema = new mongoose.Schema(
  {
    savingId: { type: mongoose.Schema.Types.ObjectId, ref: "Saving", required: true },
    amount: { type: Number, required: true },
    note: { type: String },
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const SavingDeposit = mongoose.model("SavingDeposit", savingDepositSchema);
export default SavingDeposit;