import { config } from "./config/index.js";
import { logger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/error.js";
import { router } from "./routes/index.js";

/**
 * Simple router matcher for Bun native server
 */
async function match_route(pathname: string, method: string, req: Request): Promise<Response | null> {
  return await router(pathname, method, req);
}

const server = Bun.serve({
  port: config.port,
  async fetch(req) {
    const url = new URL(req.url);
    const start = Date.now();

    try {
      // Health check
      if (url.pathname === "/health" && req.method === "GET") {
        const response = Response.json({
          status: "ok",
          timestamp: new Date().toISOString(),
        });
        logger(req, response, Date.now() - start);
        return response;
      }

      // Match routes
      const response = await match_route(url.pathname, req.method, req);
      if (response) {
        logger(req, response, Date.now() - start);
        return response;
      }

      // 404 Not Found
      const notFoundResponse = Response.json(
        { error: "Not Found" },
        { status: 404 }
      );
      logger(req, notFoundResponse, Date.now() - start);
      return notFoundResponse;
    } catch (error) {
      return errorHandler(error, req);
    }
  },
});

console.log(`🚀 Server running on http://localhost:${server.port}`);
