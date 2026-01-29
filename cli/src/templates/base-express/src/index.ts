import express from "express";
import { logger as loggerMiddleware } from "./middleware/logger.js";
import {error_handler} from "./middleware/error-handler.js";
import routes from "./routes/index.js";
import { config } from "./config/index.js";
import { success_handler } from "./middleware/succcess-handler.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);
app.use(success_handler)

// Routes
app.use("/", routes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handler (must be last)
app.use(error_handler);

app.listen(config.port, () => {
  console.log(`🚀 Server running on http://localhost:${config.port}`);
});
