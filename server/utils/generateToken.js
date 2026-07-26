import jwt from "jsonwebtoken";

export default function generateToken(res, id) {
  const token = jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
}