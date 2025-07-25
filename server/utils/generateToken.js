const jwt = require("jsonwebtoken");

function generateToken(res, id) {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
}

module.exports = generateToken;
