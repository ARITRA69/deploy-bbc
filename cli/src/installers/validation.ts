import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { type InstallerOptions, AvailablePackages } from "../types/index.js";
import { add_package_dependency } from "../utils/add-package-dependency.js";
import { DEPENDENCY_VERSION_MAP } from "../utils/dependency-version-map.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Validation installer - handles Zod and Yup validation libraries.
 *
 * @param options - Installer options with selected packages
 */
export async function validation_installer(
  options: InstallerOptions
): Promise<void> {
  const { projectDir, packages } = options;

  for (const pkg of packages) {
    switch (pkg) {
      case AvailablePackages.zod:
        await install_zod(projectDir);
        break;
      case AvailablePackages.yup:
        await install_yup(projectDir);
        break;
    }
  }
}

async function install_zod(projectDir: string): Promise<void> {
  const templateDir = path.resolve(
    __dirname,
    "templates/extras/validation/zod"
  );
  await copy_template_files(templateDir, projectDir);

  await add_package_dependency(projectDir, {
    zod: DEPENDENCY_VERSION_MAP["zod"],
  });
}

async function install_yup(projectDir: string): Promise<void> {
  const templateDir = path.resolve(
    __dirname,
    "templates/extras/validation/yup"
  );
  await copy_template_files(templateDir, projectDir);

  await add_package_dependency(projectDir, {
    yup: DEPENDENCY_VERSION_MAP["yup"],
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
