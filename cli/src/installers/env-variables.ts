import path from "path";
import fs from "fs-extra";
import { type InstallerOptions } from "../types/index.js";

/**
 * Environment variables installer - creates an empty .env file.
 * The .env.example file is populated by individual installers as they run.
 * This installer ensures a .env file exists for local development.
 *
 * @param options - Installer options
 */
export async function env_variables_installer(
  options: InstallerOptions
): Promise<void> {
  const { projectDir } = options;

  // Create empty .env file (will be git-ignored)
  const envPath = path.join(projectDir, ".env");

  // Only create if it doesn't exist
  if (!(await fs.pathExists(envPath))) {
    await fs.writeFile(
      envPath,
      "# Copy values from .env.example and fill in your actual credentials\n"
    );
  }
}
