import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { type InstallerOptions, AvailablePackages } from "../types/index.js";
import { add_package_dependency } from "../utils/add-package-dependency.js";
import { DEPENDENCY_VERSION_MAP } from "../utils/dependency-version-map.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Database installer - handles postgres, mysql, mongodb, and redis setup.
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
    "../templates/extras/database/postgres"
  );
  await copy_template_files(templateDir, projectDir);

  // Add dependencies
  await add_package_dependency(projectDir, {
    postgres: DEPENDENCY_VERSION_MAP["postgres"],
    "drizzle-orm": DEPENDENCY_VERSION_MAP["drizzle-orm"],
  });

  await add_package_dependency(
    projectDir,
    {},
    {
      "drizzle-kit": DEPENDENCY_VERSION_MAP["drizzle-kit"],
    }
  );

  // Append to .env.example
  await append_env_example(
    projectDir,
    "\n# PostgreSQL Configuration\nDATABASE_URL=postgresql://user:password@localhost:5432/dbname\n"
  );

  // Add db scripts to package.json
  await add_db_scripts(projectDir, "postgres");
}

async function install_mysql(projectDir: string): Promise<void> {
  // Copy template files
  const templateDir = path.resolve(
    __dirname,
    "../templates/extras/database/mysql"
  );
  await copy_template_files(templateDir, projectDir);

  // Add dependencies
  await add_package_dependency(projectDir, {
    mysql2: DEPENDENCY_VERSION_MAP["mysql2"],
    "drizzle-orm": DEPENDENCY_VERSION_MAP["drizzle-orm"],
  });

  await add_package_dependency(
    projectDir,
    {},
    {
      "drizzle-kit": DEPENDENCY_VERSION_MAP["drizzle-kit"],
    }
  );

  // Append to .env.example
  await append_env_example(
    projectDir,
    "\n# MySQL Configuration\nDATABASE_URL=mysql://user:password@localhost:3306/dbname\n"
  );

  // Add db scripts to package.json
  await add_db_scripts(projectDir, "mysql");
}

async function install_mongodb(projectDir: string): Promise<void> {
  // Copy template files
  const templateDir = path.resolve(
    __dirname,
    "../templates/extras/database/mongodb"
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
    "../templates/extras/database/redis"
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

  // Copy root config files (e.g., drizzle.config.ts)
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

/**
 * Adds database migration scripts to package.json
 */
async function add_db_scripts(
  projectDir: string,
  dbType: "postgres" | "mysql"
): Promise<void> {
  const packageJsonPath = path.join(projectDir, "package.json");
  const packageJson = await fs.readJson(packageJsonPath);

  packageJson.scripts = {
    ...packageJson.scripts,
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio",
  };

  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
}
