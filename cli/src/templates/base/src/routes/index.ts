import { Hono } from "hono";

const routes = new Hono();

routes.get("/", (c) => {
  return c.json({
    message: "Welcome to your Bun backend!",
    docs: "/docs",
  });
});

export default routes;
