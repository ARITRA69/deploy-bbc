import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { type InstallerOptions, AvailablePackages } from "../types/index.js";
import { add_package_dependency } from "../utils/add-package-dependency.js";
import { DEPENDENCY_VERSION_MAP } from "../utils/dependency-version-map.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Realtime installer - handles Socket.IO and Server-Sent Events (SSE).
 *
 * @param options - Installer options with selected packages
 */
export async function realtime_installer(
  options: InstallerOptions
): Promise<void> {
  const { projectDir, packages } = options;

  for (const pkg of packages) {
    switch (pkg) {
      case AvailablePackages.socketio:
        await install_socketio(projectDir);
        break;
      case AvailablePackages.sse:
        await install_sse(projectDir);
        break;
    }
  }
}

async function install_socketio(projectDir: string): Promise<void> {
  const templateDir = path.resolve(
    __dirname,
    "../templates/extras/realtime/socketio"
  );
  await copy_template_files(templateDir, projectDir);

  await add_package_dependency(projectDir, {
    "socket.io": DEPENDENCY_VERSION_MAP["socket.io"],
  });

  await add_package_dependency(
    projectDir,
    {},
    {
      "@types/socket.io": DEPENDENCY_VERSION_MAP["@types/socket.io"],
    }
  );
}

async function install_sse(projectDir: string): Promise<void> {
  const templateDir = path.resolve(
    __dirname,
    "../templates/extras/realtime/sse"
  );
  await copy_template_files(templateDir, projectDir);

  // SSE has no external dependencies, it's a native web standard
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
}
