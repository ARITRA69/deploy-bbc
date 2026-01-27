import chalk from "chalk";

/**
 * Displays a styled section header in the terminal.
 * Used to visually separate different stages of the CLI execution.
 *
 * @param title - The title text to display
 */
export function render_title(title: string): void {
  console.log("\n" + chalk.bold.cyan(`▸ ${title}`));
}
