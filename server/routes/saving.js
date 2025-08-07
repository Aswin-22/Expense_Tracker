import express from "express";
import { createSaving, deleteSaving, addDeposit } from "../controllers/saving.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createSaving);
router.delete("/:id", protect, deleteSaving);
router.post("/add-deposit/:id", protect, addDeposit);

export default router;
