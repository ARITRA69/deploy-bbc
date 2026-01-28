import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { type InstallerOptions, AvailablePackages } from "../types/index.js";
import { add_package_dependency } from "../utils/add-package-dependency.js";
import { DEPENDENCY_VERSION_MAP } from "../utils/dependency-version-map.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Queue installer - handles BullMQ and Inngest.
 *
 * @param options - Installer options with selected packages
 */
export async function queue_installer(
  options: InstallerOptions
): Promise<void> {
  const { projectDir, packages } = options;

  for (const pkg of packages) {
    switch (pkg) {
      case AvailablePackages.bullmq:
        await install_bullmq(projectDir);
        break;
      case AvailablePackages.inngest:
        await install_inngest(projectDir);
        break;
    }
  }
}

async function install_bullmq(projectDir: string): Promise<void> {
  const templateDir = path.resolve(
    __dirname,
    "templates/extras/queue/bullmq"
  );
  await copy_template_files(templateDir, projectDir);

  await add_package_dependency(projectDir, {
    bullmq: DEPENDENCY_VERSION_MAP["bullmq"],
  });

  await append_env_example(
    projectDir,
    "\n# BullMQ Configuration\nREDIS_HOST=localhost\nREDIS_PORT=6379\nREDIS_PASSWORD=\n"
  );
}

async function install_inngest(projectDir: string): Promise<void> {
  const templateDir = path.resolve(
    __dirname,
    "templates/extras/queue/inngest"
  );
  await copy_template_files(templateDir, projectDir);

  await add_package_dependency(projectDir, {
    inngest: DEPENDENCY_VERSION_MAP["inngest"],
  });

  await append_env_example(
    projectDir,
    "\n# Inngest Configuration\nINNGEST_EVENT_KEY=your-inngest-event-key\nINNGEST_SIGNING_KEY=your-inngest-signing-key\n"
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
