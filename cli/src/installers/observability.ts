import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { type InstallerOptions, AvailablePackages } from "../types/index.js";
import { add_package_dependency } from "../utils/add-package-dependency.js";
import { DEPENDENCY_VERSION_MAP } from "../utils/dependency-version-map.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Observability installer - handles Sentry and Logtail.
 *
 * @param options - Installer options with selected packages
 */
export async function observability_installer(
  options: InstallerOptions
): Promise<void> {
  const { projectDir, packages } = options;

  for (const pkg of packages) {
    switch (pkg) {
      case AvailablePackages.sentry:
        await install_sentry(projectDir);
        break;
      case AvailablePackages.logtail:
        await install_logtail(projectDir);
        break;
    }
  }
}

async function install_sentry(projectDir: string): Promise<void> {
  const templateDir = path.resolve(
    __dirname,
    "templates/extras/observability/sentry"
  );
  await copy_template_files(templateDir, projectDir);

  await add_package_dependency(projectDir, {
    "@sentry/node": DEPENDENCY_VERSION_MAP["@sentry/node"],
  });

  await append_env_example(
    projectDir,
    "\n# Sentry Configuration\nSENTRY_DSN=your-sentry-dsn-here\nSENTRY_ENVIRONMENT=production\n"
  );
}

async function install_logtail(projectDir: string): Promise<void> {
  const templateDir = path.resolve(
    __dirname,
    "templates/extras/observability/logtail"
  );
  await copy_template_files(templateDir, projectDir);

  await add_package_dependency(projectDir, {
    "@logtail/node": DEPENDENCY_VERSION_MAP["@logtail/node"],
  });

  await append_env_example(
    projectDir,
    "\n# Logtail Configuration\nLOGTAIL_SOURCE_TOKEN=your-logtail-source-token-here\n"
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
