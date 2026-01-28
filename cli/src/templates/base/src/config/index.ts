import { load_env } from "../utils/env.js";

load_env();

export const config = {
  port: parseInt(process.env.PORT || "8000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
} as const;
