import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { type InstallerOptions, AvailablePackages } from "../types/index.js";
import { add_package_dependency } from "../utils/add-package-dependency.js";
import { DEPENDENCY_VERSION_MAP } from "../utils/dependency-version-map.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Docs installer - handles Swagger and Scalar API documentation.
 *
 * @param options - Installer options with selected packages
 */
export async function docs_installer(
  options: InstallerOptions
): Promise<void> {
  const { projectDir, packages } = options;

  for (const pkg of packages) {
    switch (pkg) {
      case AvailablePackages.swagger:
        await install_swagger(projectDir);
        break;
      case AvailablePackages.scalar:
        await install_scalar(projectDir);
        break;
    }
  }
}

async function install_swagger(projectDir: string): Promise<void> {
  const templateDir = path.resolve(
    __dirname,
    "templates/extras/docs/swagger"
  );
  await copy_template_files(templateDir, projectDir);

  await add_package_dependency(projectDir, {
    "@hono/swagger": DEPENDENCY_VERSION_MAP["@hono/swagger"],
  });
}

async function install_scalar(projectDir: string): Promise<void> {
  const templateDir = path.resolve(
    __dirname,
    "templates/extras/docs/scalar"
  );
  await copy_template_files(templateDir, projectDir);

  await add_package_dependency(projectDir, {
    "@scalar/hono-api-reference": DEPENDENCY_VERSION_MAP["@scalar/hono-api-reference"],
  });
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
