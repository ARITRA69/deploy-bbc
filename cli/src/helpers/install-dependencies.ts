import { execa } from "execa";
import ora from "ora";

/**
 * Installs project dependencies using Bun package manager.
 * Runs `bun install` in the project directory.
 *
 * @param projectDir - Absolute path to the project directory
 * @throws Error if installation fails
 */
export async function install_dependencies(projectDir: string): Promise<void> {
  const spinner = ora("Installing dependencies...").start();

  try {
    await execa("bun", ["install"], {
      cwd: projectDir,
      stdio: "inherit",
    });

    spinner.succeed("Dependencies installed successfully");
  } catch (error) {
    spinner.fail("Failed to install dependencies");
    console.error("\nYou can install dependencies manually by running:");
    console.error(`  cd ${projectDir}`);
    console.error(`  bun install\n`);
    throw error;
  }
}
