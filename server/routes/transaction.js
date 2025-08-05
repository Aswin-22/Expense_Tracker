import express from "express"
import {
  handleNewTransaction,
  getAllTransactions,
  deleteTransaction,
} from "../controllers/transaction.js"
import { protect } from "../middlewares/authMiddleware.js";

 const router = express.Router();

router.post("/", protect, handleNewTransaction);
router.get("/", protect, getAllTransactions);
router.delete("/:id", protect, deleteTransaction);

export default router;
