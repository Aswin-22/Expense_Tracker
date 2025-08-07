import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";

import connectDb  from "./config/db.js";
import userRouter from "./routes/user.js";
import transactionRouter from "./routes/transaction.js";
import savingRouter from "./routes/saving.js"
import categoryRouter from "./routes/category.js"


import errorHandler from "./middlewares/errorMiddleware.js";

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

app.use("/api/user", userRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/saving", savingRouter);
app.use("/api/category", categoryRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
