import path from "path";
import fs from "fs-extra";

/**
 * Adds dependencies to a project's package.json file.
 * Reads the file, merges dependencies, sorts keys alphabetically, and writes back.
 *
 * @param projectDir - Absolute path to the project directory
 * @param dependencies - Dependencies to add to the "dependencies" section
 * @param devDependencies - Optional dev dependencies to add to "devDependencies" section
 */
export async function add_package_dependency(
  projectDir: string,
  dependencies: Record<string, string>,
  devDependencies?: Record<string, string>
): Promise<void> {
  const packageJsonPath = path.join(projectDir, "package.json");

  // Read existing package.json
  const packageJson = await fs.readJson(packageJsonPath);

  // Merge dependencies
  if (dependencies && Object.keys(dependencies).length > 0) {
    packageJson.dependencies = {
      ...packageJson.dependencies,
      ...dependencies,
    };

    // Sort dependencies alphabetically
    packageJson.dependencies = Object.keys(packageJson.dependencies)
      .sort()
      .reduce((acc: Record<string, string>, key: string) => {
        acc[key] = packageJson.dependencies[key];
        return acc;
      }, {});
  }

  // Merge devDependencies
  if (devDependencies && Object.keys(devDependencies).length > 0) {
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      ...devDependencies,
    };

    // Sort devDependencies alphabetically
    packageJson.devDependencies = Object.keys(packageJson.devDependencies)
      .sort()
      .reduce((acc: Record<string, string>, key: string) => {
        acc[key] = packageJson.devDependencies[key];
        return acc;
      }, {});
  }

  // Write back to package.json with proper formatting
  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
}
