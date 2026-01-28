import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { type InstallerOptions, AvailablePackages } from "../types/index.js";
import { add_package_dependency } from "../utils/add-package-dependency.js";
import { DEPENDENCY_VERSION_MAP } from "../utils/dependency-version-map.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Testing installer - handles Vitest testing framework.
 *
 * @param options - Installer options with selected packages
 */
export async function testing_installer(
  options: InstallerOptions
): Promise<void> {
  const { projectDir, packages } = options;

  for (const pkg of packages) {
    switch (pkg) {
      case AvailablePackages.vitest:
        await install_vitest(projectDir);
        break;
    }
  }
}

async function install_vitest(projectDir: string): Promise<void> {
  const templateDir = path.resolve(
    __dirname,
    "templates/extras/testing/vitest"
  );
  await copy_template_files(templateDir, projectDir);

  await add_package_dependency(projectDir, {
    vitest: DEPENDENCY_VERSION_MAP["vitest"],
    "@vitest/ui": DEPENDENCY_VERSION_MAP["@vitest/ui"],
    supertest: DEPENDENCY_VERSION_MAP["supertest"],
  });

  await add_package_dependency(
    projectDir,
    {},
    {
      "@types/supertest": DEPENDENCY_VERSION_MAP["@types/supertest"],
    }
  );
}

async function copy_template_files(
  templateDir: string,
  projectDir: string
): Promise<void> {
  if (!(await fs.pathExists(templateDir))) {
    return;
  }

  const srcDir = path.join(templateDir, "src");
  if (await fs.pathExists(srcDir)) {
    const targetSrcDir = path.join(projectDir, "src");
    await fs.copy(srcDir, targetSrcDir, {
      overwrite: false,
      errorOnExist: false,
    });
  }

  const templateFiles = await fs.readdir(templateDir);
  for (const file of templateFiles) {
    if (file !== "src" && (file.endsWith(".ts") || file.endsWith(".json"))) {
      const srcFile = path.join(templateDir, file);
      const destFile = path.join(projectDir, file);

      if (!(await fs.pathExists(destFile))) {
        await fs.copy(srcFile, destFile);
      }
    }
  }
}

async function append_env_example(
  projectDir: string,
  content: string
): Promise<void> {
  const envPath = path.join(projectDir, ".env.example");
  await fs.appendFile(envPath, content);
}
