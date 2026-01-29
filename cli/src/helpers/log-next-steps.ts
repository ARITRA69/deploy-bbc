import chalk from "chalk";
import { type InstallerOptions } from "../types/index.js";
import { type CliResults } from "../types/index.js";
import { AvailablePackages } from "../types/index.js";

/**
 * Displays next steps for the user after project creation.
 * Shows commands for navigation, Docker setup, migrations, and running the dev server.
 *
 * @param options - Installer options with project configuration
 * @param cliResults - CLI results with selected packages and flags
 */
export function log_next_steps(
  options: InstallerOptions,
  cliResults: CliResults
): void {
  const { appName, packages, projectDir } = options;

  // Check if project was created in current directory
  const isCurrentDirectory = projectDir === process.cwd();

  console.log("\n" + chalk.bold.green("✨ Project created successfully!"));
  console.log("\n" + chalk.bold("Next steps:"));
  console.log();

  let stepNumber = 1;

  // Step 1: Navigate to project (skip if current directory)
  if (!isCurrentDirectory) {
    console.log(chalk.cyan(`${stepNumber}.`) + " Navigate to your project:");
    console.log(`   ${chalk.gray("cd")} ${appName}`);
    console.log();
    stepNumber++;
  }

  // Step: Environment variables
  console.log(chalk.cyan(`${stepNumber}.`) + " Set up environment variables:");
  console.log(`   ${chalk.gray("cp")} .env.example .env`);
  console.log(`   ${chalk.gray("# Edit .env with your configuration")}`);
  console.log();
  stepNumber++;

  // Step 3: Docker (if dockerize is enabled)
  const hasDocker = cliResults.flags.dockerizeDb || cliResults.flags.dockerizeBackend;

  if (hasDocker) {
    console.log(chalk.cyan(`${stepNumber}.`) + " Start Docker services:");
    console.log(`   ${chalk.gray("bun run docker:dev")}`);
    console.log();
    stepNumber++;
  }

  // Step 4: Database migrations (if postgres or mysql)
  const needsMigration =
    packages.includes(AvailablePackages.postgres) ||
    packages.includes(AvailablePackages.mysql);

  if (needsMigration) {
    console.log(chalk.cyan(`${stepNumber}.`) + " Run database migrations:");
    console.log(`   ${chalk.gray("bun run db:migrate")}`);
    console.log();
    stepNumber++;
  }

  // Step: Start development server
  console.log(chalk.cyan(`${stepNumber}.`) + " Start the development server:");
  console.log(`   ${chalk.gray("bun run dev")}`);
  console.log();

  // Additional info for docs
  if (
    packages.includes(AvailablePackages.swagger) ||
    packages.includes(AvailablePackages.scalar)
  ) {
    console.log(
      chalk.bold("📚 API Documentation:") + " http://localhost:8000/docs"
    );
    console.log();
  }

  console.log(chalk.gray("Happy coding! 🚀"));
  console.log();
}
