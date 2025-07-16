const express = require("express");
const {
  handleNewTransaction,
  getAllTransactions,
  deleteTransaction,
} = require("../controllers/transaction");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, handleNewTransaction);
router.get("/", protect, getAllTransactions);
router.delete("/:id", protect, deleteTransaction);

module.exports = router;
