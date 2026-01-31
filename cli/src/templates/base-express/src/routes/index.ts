import express, { Router, Request, Response } from "express";
import { user_route } from "./user.route.js";

const router = Router();

// Root route
router.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to your Bun backend!",
    docs: "/docs",
  });
});

// User routes
router.use("/users", user_route);

export { router as routes };
