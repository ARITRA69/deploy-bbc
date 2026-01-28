import { Hono } from "hono";
import user_route from "./user.route.js";

const routes = new Hono();

// Root route
routes.get("/", (c) => {
  return c.json({
    message: "Welcome to your Bun backend!",
    docs: "/docs",
  });
});

// User routes
routes.route("/users", user_route);

export default routes;
