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
  _cliResults: CliResults
): void {
  const { appName, packages } = options;

  console.log("\n" + chalk.bold.green("✨ Project created successfully!"));
  console.log("\n" + chalk.bold("Next steps:"));
  console.log();

  // Step 1: Navigate to project
  console.log(chalk.cyan("1.") + " Navigate to your project:");
  console.log(`   ${chalk.gray("cd")} ${appName}`);
  console.log();

  // Step 2: Environment variables
  console.log(chalk.cyan("2.") + " Set up environment variables:");
  console.log(`   ${chalk.gray("cp")} .env.example .env`);
  console.log(`   ${chalk.gray("# Edit .env with your configuration")}`);
  console.log();

  // Step 3: Docker (if database or redis selected)
  const hasDocker =
    packages.includes(AvailablePackages.postgres) ||
    packages.includes(AvailablePackages.mysql) ||
    packages.includes(AvailablePackages.mongodb) ||
    packages.includes(AvailablePackages.redis);

  if (hasDocker) {
    console.log(chalk.cyan("3.") + " Start Docker services:");
    console.log(`   ${chalk.gray("docker-compose up -d")}`);
    console.log();
  }

  // Step 4: Database migrations (if postgres or mysql)
  const needsMigration =
    packages.includes(AvailablePackages.postgres) ||
    packages.includes(AvailablePackages.mysql);

  if (needsMigration) {
    const stepNum = hasDocker ? "4" : "3";
    console.log(chalk.cyan(`${stepNum}.`) + " Run database migrations:");
    console.log(`   ${chalk.gray("bun run db:migrate")}`);
    console.log();
  }

  // Step 5: Start development server
  const lastStepNum = needsMigration
    ? hasDocker
      ? "5"
      : "4"
    : hasDocker
    ? "4"
    : "3";
  console.log(chalk.cyan(`${lastStepNum}.`) + " Start the development server:");
  console.log(`   ${chalk.gray("bun run dev")}`);
  console.log();

  // Additional info for docs
  if (
    packages.includes(AvailablePackages.swagger) ||
    packages.includes(AvailablePackages.scalar)
  ) {
    console.log(
      chalk.bold("📚 API Documentation:") + " http://localhost:3000/docs"
    );
    console.log();
  }

  console.log(chalk.gray("Happy coding! 🚀"));
  console.log();
}
