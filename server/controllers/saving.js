import mongoose from "mongoose";
import Saving from "../models/Savings.js";
import SavingDeposit from "../models/SavingsDeposit.js";


export const addDeposit = async (req, res) => {
  const { savingsId } = req.params;
  const { amount, note } = req.body;
  const userId = req.user._id; 

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const saving = await Saving.findOne({ _id: savingsId, user: userId }).session(session);
    if (!saving) {
      throw new Error("Saving not found or not owned by user");
    }

    const deposit = await SavingDeposit.create(
      [
        {
          savingsId,
          amount,
          note,
        },
      ],
      { session }
    );
    const createdDeposit = deposit[0]; 

    await Saving.findByIdAndUpdate(
      savingsId,
      {
        $inc: { currentAmount: amount },
        $push: { deposits: createdDeposit._id },
      },
      { session }
    );

    await session.commitTransaction();
    res.status(201).json({ success: true, deposit: createdDeposit });
  } catch (err) {
    await session.abortTransaction();
    console.error("addDeposit error:", err);
    res.status(400).json({ success: false, message: err.message || "Failed to add deposit" });
  } finally {
    session.endSession();
  }
};


export const createSaving = async (req, res) => {
  const { savingName, goalAmount } = req.body;
  const userId = req.user._id;

  try {
    const saving = await Saving.create({
      user: userId,
      savingName,
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

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const saving = await Saving.findOneAndDelete(
      { _id: savingsId, user: userId },
      { session }
    );
    if (!saving) throw new Error("Saving not found");

    await SavingDeposit.deleteMany({ savingsId: saving._id }, { session });

    await session.commitTransaction();
    res.json({ success: true });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};



