const mongoose = require("mongoose");
const { Schema } = mongoose;

const savingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    goalAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
    deposits: [{ type: Schema.Types.ObjectId, ref: "savingDeposit" }],
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const Saving = mongoose.model("SAVING",savingSchema);

module.exports = Saving;