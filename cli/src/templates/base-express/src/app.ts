import express,{Request, Response} from "express";
import { logger as loggerMiddleware } from "./middleware/logger.js";
import { error_handler } from "./middleware/error-handler.js";
import { routes } from "./routes/index.js";
import { success_handler } from "./middleware/succcess-handler.js";
import { createServer } from "http";

const app = express();
const http_server = createServer(app)

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);
app.use(success_handler)

// Routes
app.use("/", routes);

// Health check
app.get("/health", (req:Request, res:Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handler (must be last)
app.use(error_handler);

export { app, http_server }