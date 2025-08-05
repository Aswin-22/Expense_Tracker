
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  console.error(`[Error] ${statusCode} - ${err.message}\n${err.stack || ""}`);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    // Optionally, include the stack trace only in development mode for debugging
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;


