const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  logOut,
  authMe,
} = require("../controllers/user");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.get("/auth", authMe);
router.post("/logout", protect, logOut);

module.exports = router;
