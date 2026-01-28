import path from "path";
import fs from "fs-extra";
import ora from "ora";
import { fileURLToPath } from "url";
import { type InstallerOptions } from "../types/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Scaffolds the base project structure by copying template files.
 * Creates the project directory and copies all files from the selected template.
 *
 * Special handling:
 * - If projectDir is current directory: allows scaffolding but checks for conflicts (src/, package.json)
 * - If projectDir is a new directory: creates it and requires it to be empty
 *
 * @param options - Installer options containing projectDir and other config
 * @throws Error if project directory already exists and is not empty, or if conflicts detected in current directory
 */
export async function scaffold_project(
  options: InstallerOptions
): Promise<void> {
  const { projectDir, appName, framework } = options;
  const spinner = ora("Scaffolding project...").start();

  try {
    const isCurrentDirectory = projectDir === process.cwd();

    // Check if directory exists and is not empty (skip for current directory)
    if (!isCurrentDirectory && await fs.pathExists(projectDir)) {
      const files = await fs.readdir(projectDir);
      if (files.length > 0) {
        spinner.fail(`Directory ${projectDir} already exists and is not empty`);
        throw new Error(
          `Cannot create project: directory "${appName}" is not empty`
        );
      }
    }

    // If scaffolding in current directory, check for conflicts
    if (isCurrentDirectory) {
      const conflictingPaths = ["src", "package.json"];
      const conflicts = [];

      for (const pathToCheck of conflictingPaths) {
        if (await fs.pathExists(path.join(projectDir, pathToCheck))) {
          conflicts.push(pathToCheck);
        }
      }

      if (conflicts.length > 0) {
        spinner.fail("Cannot scaffold in current directory");
        throw new Error(
          `The following files/folders already exist: ${conflicts.join(", ")}\n` +
          "Please use an empty directory or choose a different location."
        );
      }
    }

    // Ensure project directory exists
    await fs.ensureDir(projectDir);

    // Select base template based on framework
    const templateDirName = framework === "hono"
      ? "base"
      : framework === "express"
        ? "base-express"
        : "base-bun-native";

    const templateDir = path.resolve(__dirname, `templates/${templateDirName}`);
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
