import Saving from "../models/Savings.js" 
import SavingDeposit from "../models/SavingsDeposit.js";
import { withTransaction } from "../utils/transaction.js"

export const addDeposit = async (req, res) => {
  const { savingsId } = req.params;
  const { amount, note } = req.body;
  const userId = req.user._id;

  try {
    const result = await withTransaction(async (session) => {
      const saving = await Saving.findOne({ 
        _id: savingsId, 
        userId: userId 
      }).session(session);
      
      if (!saving) {
        throw new Error("Saving not found or not owned by user");
      }

      const deposit = await SavingDeposit.create([{
        savingId: savingsId, 
        amount,
        note,
      }], { session });

      const createdDeposit = deposit[0];

      await Saving.findByIdAndUpdate(
        savingsId,
        {
          $inc: { currentAmount: amount },
          $push: { deposits: createdDeposit._id },
        },
        { session }
      );

      return createdDeposit;
    });

    res.status(201).json({ success: true, deposit: result });
  } catch (err) {
    console.error("addDeposit error:", err);
    res.status(400).json({ 
      success: false, 
      message: err.message || "Failed to add deposit" 
    });
  }
};

export const createSaving = async (req, res) => {
  const { savingName, goalAmount } = req.body;
  const userId = req.user._id;

  try {
    const saving = await Saving.create({
      userId: userId, 
      name: savingName, 
      goalAmount,
      currentAmount: 0,
      deposits: [],
    });
    res.status(201).json({ success: true, saving });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteSaving = async (req, res) => {
  const { savingsId } = req.params;
  const userId = req.user._id;

  try {
    const result = await withTransaction(async (session) => {
      const saving = await Saving.findOneAndDelete(
        { _id: savingsId, userId: userId }, 
        { session }
      );
      
      if (!saving) {
        throw new Error("Saving not found");
      }

      await SavingDeposit.deleteMany({ 
        savingId: saving._id 
      }, { session });

      return saving;
    });

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
