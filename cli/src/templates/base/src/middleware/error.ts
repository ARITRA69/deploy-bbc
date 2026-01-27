import type { ErrorHandler } from "hono";

export const errorHandler: ErrorHandler = (err, c) => {
  console.error(`Error: ${err.message}`, err);
  
  return c.json(
    {
      error: err.message || "Internal Server Error",
      status: err.status || 500,
    },
    err.status || 500
  );
};
