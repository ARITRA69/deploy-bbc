import { type CliResults, type InstallerOptions } from "../types/index.js";
import { parse_name_and_path } from "../utils/parse-name-and-path.js";
import { scaffold_project } from "./scaffold-project.js";
import { build_installer_map, run_installers } from "../installers/index.js";
import { generate_dockerfile } from "./generate-dockerfile.js";
import { generate_docker_compose } from "./generate-docker-compose.js";
import { install_dependencies } from "./install-dependencies.js";
import { init_git } from "./init-git.js";
import { log_next_steps } from "./log-next-steps.js";
import { render_title } from "../utils/render-title.js";

/**
 * Main orchestration function for project creation.
 * Coordinates all steps: parsing, scaffolding, installing packages, and setup.
 *
 * @param cliResults - Results from CLI argument parsing
 */
export async function create_project(cliResults: CliResults): Promise<void> {
  try {
    // Step 1: Parse and validate project name and path
    render_title("Validating project name");
    const { projectName, projectDir } = parse_name_and_path(cliResults.appName);

    // Step 2: Create installer options
    const installerOptions: InstallerOptions = {
      projectDir,
      appName: projectName,
      framework: cliResults.framework,
      packages: cliResults.packages,
      noInstall: cliResults.flags.noInstall,
    };

    // Step 3: Scaffold base project structure
    render_title("Creating project structure");
    await scaffold_project(installerOptions);

    // Step 4: Build installer map and run installers
    render_title("Installing selected packages");
    const installerMap = build_installer_map(installerOptions);
    await run_installers(installerMap, installerOptions);

    // Step 5: Generate Docker files
    render_title("Generating Docker configuration");
    await generate_dockerfile(installerOptions);
    await generate_docker_compose(installerOptions);

    // Step 6: Install dependencies (unless --noInstall flag)
    if (!cliResults.flags.noInstall) {
      render_title("Installing dependencies");
      await install_dependencies(projectDir);
    }

    // Step 7: Initialize Git (unless --noGit flag)
    if (!cliResults.flags.noGit) {
      render_title("Initializing Git repository");
      await init_git(projectDir);
    }

    // Step 8: Display next steps
    log_next_steps(installerOptions, cliResults);
  } catch (error) {
    console.error("\n❌ Project creation failed:");
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}