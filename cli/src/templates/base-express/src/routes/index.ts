import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Welcome to your Bun backend!",
    docs: "/docs",
  });
});

export default router;
