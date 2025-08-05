import mongoose from "mongoose"

export default async function withTransaction(fn) {
  const session = await mongoose.startSession();
  let transactionCompleted = false;
  
  try {
    session.startTransaction();
    const result = await fn(session);
    await session.commitTransaction();
    transactionCompleted = true;
    return result;
  } catch (err) {
    if (!transactionCompleted && session.inTransaction()) {
      await session.abortTransaction();
    }
    throw err;
  } finally {
    session.endSession();
  }
}
