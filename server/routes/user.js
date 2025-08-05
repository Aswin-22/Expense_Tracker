import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  logOut,
  authMe,
} from "../controllers/user.js";
import { protect } from "../middlewares/authMiddleware.js"

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.get("/auth", authMe);
router.post("/logout", protect, logOut);

export default router; 
