import { execa } from "execa";
import chalk from "chalk";

/**
 * Initializes a Git repository and creates an initial commit.
 * Does not throw on failure - git is optional.
 *
 * @param projectDir - Absolute path to the project directory
 */
export async function init_git(projectDir: string): Promise<void> {
  try {
    // Initialize git repository
    await execa("git", ["init"], { cwd: projectDir });

    // Add all files
    await execa("git", ["add", "."], { cwd: projectDir });

    // Create initial commit
    await execa(
      "git",
      ["commit", "-m", "Initial commit from deploy-bbc"],
      { cwd: projectDir }
    );

    console.log(chalk.green("✓") + " Git repository initialized");
  } catch (error) {
    // Git initialization is optional, so just warn on failure
    console.log(
      chalk.yellow("⚠") +
        " Git initialization failed (this is optional and can be done manually)"
    );
  }
}
