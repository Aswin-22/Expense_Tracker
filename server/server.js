const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");

const { connectDb } = require("./config/db");
const userRouter = require("./routes/user");
const transactionRouter = require("./routes/transaction");
const errorHandler = require("./middlewares/errorMiddleware");

const app = express();
const port = process.env.PORT || 3000;

connectDb().then(() => {
  console.log("Connected to MongoDB");
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/user", userRouter);
app.use("/transactions", transactionRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
