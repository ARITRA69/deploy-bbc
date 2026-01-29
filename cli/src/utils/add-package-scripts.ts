import path from "path";
import fs from "fs-extra";

/**
 * Adds scripts to a project's package.json file.
 * Reads the file, merges scripts, and writes back.
 *
 * @param projectDir - Absolute path to the project directory
 * @param scripts - Scripts to add to the "scripts" section
 */
export async function add_package_scripts(
  projectDir: string,
  scripts: Record<string, string>
): Promise<void> {
  const packageJsonPath = path.join(projectDir, "package.json");

  // Read existing package.json
  const packageJson = await fs.readJson(packageJsonPath);

  // Ensure scripts section exists
  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }

  // Merge scripts (new scripts will override existing ones with the same key)
  packageJson.scripts = {
    ...packageJson.scripts,
    ...scripts,
  };

  // Write back to package.json with proper formatting
  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
}
