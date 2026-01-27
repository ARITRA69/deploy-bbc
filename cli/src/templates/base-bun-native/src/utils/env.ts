import { config as dotenvConfig } from "dotenv";

export function load_env(): void {
  dotenvConfig();
}
