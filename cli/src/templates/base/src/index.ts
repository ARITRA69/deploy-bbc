import { Hono } from "hono";
import { logger as loggerMiddleware } from "./middleware/logger.js";
import { errorHandler } from "./middleware/error.js";
import routes from "./routes/index.js";
import { config } from "./config/index.js";

const app = new Hono();

// Middleware
app.use("*", loggerMiddleware);
app.onError(errorHandler);

// Routes
app.route("/", routes);

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

console.log(`🚀 Server running on http://localhost:${config.port}`);

export default {
  port: config.port,
  fetch: app.fetch,
};
