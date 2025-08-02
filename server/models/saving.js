const mongoose = require("mongoose");
const { Schema } = mongoose;

const savingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    goalAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
    deposits: [{ type: Schema.Types.ObjectId, ref: "SavingDeposit" }],
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const Saving = mongoose.model("Saving", savingSchema);
module.exports = Saving;
