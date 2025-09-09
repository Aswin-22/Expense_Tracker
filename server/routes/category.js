import express from "express";

import { addCategory, deleteCategory, getAllCategory } from "../controllers/category.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllCategory)
router.post("/", protect, addCategory);
router.delete("/:id", protect, deleteCategory);

export default router;
