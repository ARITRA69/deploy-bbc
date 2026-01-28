import express from "express";
import user_route from "./user.route.js";

const router = express.Router();

// Root route
router.get("/", (req, res) => {
  res.json({
    message: "Welcome to your Bun backend!",
    docs: "/docs",
  });
});

// User routes
router.use("/users", user_route);

export default router;
