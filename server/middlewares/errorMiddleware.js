const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  console.error(`[Error] ${statusCode} - ${err.message}\n${err.stack || ""}`);

  const response = {
    success: false,
    message: err.message || "Internal Server Error",
  };

  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export default errorHandler;