import User from "../models/user.js"
import jwt from "jsonwebtoken"
import generateToken from "../utils/generateToken.js"

export async function registerUser(req, res, next) {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      const error = new Error("The user already exists");
      error.statusCode = 400;
      throw error;
    }

    const user = await User.create({ name, email, password });
    if (user) {
      console.log(user);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        message: "User registered successfully",
      });
    } else {
      const error = new Error("Error in registeration");
      error.statusCode = 400;
      throw error;
    }
  } catch (error) {
    next(error);
  }
}

export async function loginUser(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }
  } catch (error) {
    next(error);
  }
}

export const getUserProfile = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  try {
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

export async function logOut(req, res, next) {
  try {
    res.clearCookie("jwt");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
}

export async function authMe(req, res, next) {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      const error = new Error("Not authenticated");
      error.statusCode = 401;
      throw error;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

