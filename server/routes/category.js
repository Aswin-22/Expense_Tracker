import express from "express";

import { addCategory, deleteCategory } from "../controllers/category.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addCategory);
router.delete("/:id", protect, deleteCategory);

export default router;
