import path from "path";
import fs from "fs-extra";
import ora from "ora";
import { fileURLToPath } from "url";
import { type InstallerOptions } from "../types/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Scaffolds the base project structure by copying template files.
 * Creates the project directory and copies all files from templates/base/
 *
 * @param options - Installer options containing projectDir and other config
 * @throws Error if project directory already exists and is not empty
 */
export async function scaffold_project(
  options: InstallerOptions
): Promise<void> {
  const { projectDir, appName } = options;
  const spinner = ora("Scaffolding project...").start();

  try {
    // Check if directory exists and is not empty
    if (await fs.pathExists(projectDir)) {
      const files = await fs.readdir(projectDir);
      if (files.length > 0) {
        spinner.fail(`Directory ${projectDir} already exists and is not empty`);
        throw new Error(
          `Cannot create project: directory "${appName}" is not empty`
        );
      }
    }

    // Ensure project directory exists
    await fs.ensureDir(projectDir);

    // Copy base template
    const templateDir = path.resolve(__dirname, "../templates/base");
    await fs.copy(templateDir, projectDir, {
      overwrite: false,
      errorOnExist: false,
    });

    // Update package.json with the actual project name
    const packageJsonPath = path.join(projectDir, "package.json");
    const packageJson = await fs.readJson(packageJsonPath);
    packageJson.name = appName;
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

    spinner.succeed("Project scaffolded successfully");
  } catch (error) {
    spinner.fail("Failed to scaffold project");
    throw error;
  }
}
