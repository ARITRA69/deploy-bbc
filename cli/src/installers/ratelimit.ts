import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { type InstallerOptions, AvailablePackages } from "../types/index.js";
import { add_package_dependency } from "../utils/add-package-dependency.js";
import { DEPENDENCY_VERSION_MAP } from "../utils/dependency-version-map.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Rate limit installer - handles Upstash Rate Limit and custom rate limiting.
 *
 * @param options - Installer options with selected packages
 */
export async function ratelimit_installer(
  options: InstallerOptions
): Promise<void> {
  const { projectDir, packages } = options;

  for (const pkg of packages) {
    switch (pkg) {
      case AvailablePackages.upstashRateLimit:
        await install_upstash_ratelimit(projectDir);
        break;
      case AvailablePackages.customRateLimit:
        await install_custom_ratelimit(projectDir);
        break;
    }
  }
}

async function install_upstash_ratelimit(projectDir: string): Promise<void> {
  const templateDir = path.resolve(
    __dirname,
    "templates/extras/ratelimit/upstash"
  );
  await copy_template_files(templateDir, projectDir);

  await add_package_dependency(projectDir, {
    "@upstash/ratelimit": DEPENDENCY_VERSION_MAP["@upstash/ratelimit"],
    "@upstash/redis": DEPENDENCY_VERSION_MAP["@upstash/redis"],
  });

  await append_env_example(
    projectDir,
    "\n# Upstash Rate Limit Configuration\nUPSTASH_REDIS_REST_URL=your-upstash-redis-rest-url\nUPSTASH_REDIS_REST_TOKEN=your-upstash-redis-rest-token\n"
  );
}

async function install_custom_ratelimit(projectDir: string): Promise<void> {
  const templateDir = path.resolve(
    __dirname,
    "templates/extras/ratelimit/custom"
  );
  await copy_template_files(templateDir, projectDir);

  // Custom rate limit doesn't require external dependencies
  // It uses built-in Hono middleware or custom implementation
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
