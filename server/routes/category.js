import express from "express";
import { getAllCategories } from "../controllers/category.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllCategories);

export default router;