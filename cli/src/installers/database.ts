import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { type InstallerOptions, AvailablePackages } from "../types/index.js";
import { add_package_dependency } from "../utils/add-package-dependency.js";
import { DEPENDENCY_VERSION_MAP } from "../utils/dependency-version-map.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Database installer - handles postgres, mysql, sqlite, mongodb, and redis setup.
 * Copies template files and adds necessary dependencies.
 *
 * @param options - Installer options with selected packages
 */
export async function database_installer(
  options: InstallerOptions
): Promise<void> {
  const { projectDir, packages } = options;

  // Handle each database type
  for (const pkg of packages) {
    switch (pkg) {
      case AvailablePackages.postgres:
        await install_postgres(projectDir);
        break;
      case AvailablePackages.mysql:
        await install_mysql(projectDir);
        break;
      case AvailablePackages.sqlite:
        await install_sqlite(projectDir);
        break;
      case AvailablePackages.mongodb:
        await install_mongodb(projectDir);
        break;
      case AvailablePackages.redis:
        await install_redis(projectDir);
        break;
    }
  }
}

async function install_postgres(projectDir: string): Promise<void> {
  // Copy template files
  const templateDir = path.resolve(
    __dirname,
    "templates/extras/database/postgres"
  );
  await copy_template_files(templateDir, projectDir);

  // Add dependencies
  await add_package_dependency(projectDir, {
    postgres: DEPENDENCY_VERSION_MAP["postgres"],
  });

  // Append to .env.example
  await append_env_example(
    projectDir,
    "\n# PostgreSQL Configuration\nDATABASE_URL=postgresql://user:password@localhost:5432/dbname\n"
  );
}

async function install_mysql(projectDir: string): Promise<void> {
  // Copy template files
  const templateDir = path.resolve(
    __dirname,
    "templates/extras/database/mysql"
  );
  await copy_template_files(templateDir, projectDir);

  // Add dependencies
  await add_package_dependency(projectDir, {
    mysql2: DEPENDENCY_VERSION_MAP["mysql2"],
  });

  // Append to .env.example
  await append_env_example(
    projectDir,
    "\n# MySQL Configuration\nDATABASE_URL=mysql://user:password@localhost:3306/dbname\n"
  );
}

async function install_sqlite(projectDir: string): Promise<void> {
  // Copy template files
  const templateDir = path.resolve(
    __dirname,
    "templates/extras/database/sqlite"
  );
  await copy_template_files(templateDir, projectDir);

  // No dependencies needed - bun:sqlite is built-in to Bun

  // Append to .env.example
  await append_env_example(
    projectDir,
    "\n# SQLite Configuration\nDATABASE_PATH=./data/app.db\n"
  );

  // Create data directory for SQLite database
  await fs.ensureDir(path.join(projectDir, "data"));

  // Add data directory to .gitignore
  const gitignorePath = path.join(projectDir, ".gitignore");
  const gitignoreContent = await fs.readFile(gitignorePath, "utf-8");
  if (!gitignoreContent.includes("data/")) {
    await fs.appendFile(gitignorePath, "\n# SQLite database\ndata/\n");
  }
}

async function install_mongodb(projectDir: string): Promise<void> {
  // Copy template files
  const templateDir = path.resolve(
    __dirname,
    "templates/extras/database/mongodb"
  );
  await copy_template_files(templateDir, projectDir);

  // Add dependencies
  await add_package_dependency(projectDir, {
    mongoose: DEPENDENCY_VERSION_MAP["mongoose"],
  });

  // Append to .env.example
  await append_env_example(
    projectDir,
    "\n# MongoDB Configuration\nMONGODB_URI=mongodb://localhost:27017/dbname\n"
  );
}

async function install_redis(projectDir: string): Promise<void> {
  // Copy template files
  const templateDir = path.resolve(
    __dirname,
    "templates/extras/database/redis"
  );
  await copy_template_files(templateDir, projectDir);

  // Add dependencies
  await add_package_dependency(projectDir, {
    redis: DEPENDENCY_VERSION_MAP["redis"],
  });

  // Append to .env.example
  await append_env_example(
    projectDir,
    "\n# Redis Configuration\nREDIS_URL=redis://localhost:6379\n"
  );
}

/**
 * Copies template files from source to destination.
 * Copies both src/ directory and root config files.
 */
async function copy_template_files(
  templateDir: string,
  projectDir: string
): Promise<void> {
  if (!(await fs.pathExists(templateDir))) {
    console.warn(`Template directory not found: ${templateDir}`);
    return;
  }

  // Copy src files
  const srcDir = path.join(templateDir, "src");
  if (await fs.pathExists(srcDir)) {
    const targetSrcDir = path.join(projectDir, "src");
    await fs.copy(srcDir, targetSrcDir, {
      overwrite: false,
      errorOnExist: false,
    });
  }

  // Copy root config files if any exist
  const templateFiles = await fs.readdir(templateDir);
  for (const file of templateFiles) {
    if (file !== "src" && (file.endsWith(".ts") || file.endsWith(".json"))) {
      const srcFile = path.join(templateDir, file);
      const destFile = path.join(projectDir, file);

      // Only copy if file doesn't exist
      if (!(await fs.pathExists(destFile))) {
        await fs.copy(srcFile, destFile);
      }
    }
  }
}

/**
 * Appends environment variables to .env.example
 */
async function append_env_example(
  projectDir: string,
  content: string
): Promise<void> {
  const envPath = path.join(projectDir, ".env.example");
  await fs.appendFile(envPath, content);
}
