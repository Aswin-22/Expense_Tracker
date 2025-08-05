import mongoose from "mongoose"

mongoose.set("strictQuery", true);

export default async function connectDb() {
  return mongoose.connect(process.env.MONGO_URI);
}

