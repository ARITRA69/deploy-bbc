import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { type InstallerOptions, AvailablePackages } from "../types/index.js";
import { add_package_dependency } from "../utils/add-package-dependency.js";
import { DEPENDENCY_VERSION_MAP } from "../utils/dependency-version-map.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Auth installer - handles JWT, OAuth, and session authentication.
 *
 * @param options - Installer options with selected packages
 */
export async function auth_installer(
  options: InstallerOptions
): Promise<void> {
  const { projectDir, packages } = options;

  for (const pkg of packages) {
    switch (pkg) {
      case AvailablePackages.jwt:
        await install_jwt(projectDir);
        break;
      case AvailablePackages.oauth:
        await install_oauth(projectDir);
        break;
      case AvailablePackages.session:
        await install_session(projectDir);
        break;
    }
  }
}

async function install_jwt(projectDir: string): Promise<void> {
  const templateDir = path.resolve(__dirname, "templates/extras/auth/jwt");
  await copy_template_files(templateDir, projectDir);

  await add_package_dependency(projectDir, {
    jsonwebtoken: DEPENDENCY_VERSION_MAP["jsonwebtoken"],
    bcryptjs: DEPENDENCY_VERSION_MAP["bcryptjs"],
  });

  await add_package_dependency(
    projectDir,
    {},
    {
      "@types/jsonwebtoken": DEPENDENCY_VERSION_MAP["@types/jsonwebtoken"],
      "@types/bcryptjs": DEPENDENCY_VERSION_MAP["@types/bcryptjs"],
    }
  );

  await append_env_example(
    projectDir,
    "\n# JWT Authentication\nJWT_SECRET=your-super-secret-jwt-key-change-this\nJWT_EXPIRES_IN=7d\n"
  );
}

async function install_oauth(projectDir: string): Promise<void> {
  const templateDir = path.resolve(__dirname, "templates/extras/auth/oauth");
  await copy_template_files(templateDir, projectDir);

  await add_package_dependency(projectDir, {
    passport: DEPENDENCY_VERSION_MAP["passport"],
    "passport-oauth2": DEPENDENCY_VERSION_MAP["passport-oauth2"],
  });

  await add_package_dependency(
    projectDir,
    {},
    {
      "@types/passport": DEPENDENCY_VERSION_MAP["@types/passport"],
    }
  );

  await append_env_example(
    projectDir,
    "\n# OAuth Configuration\nOAUTH_CLIENT_ID=your-client-id\nOAUTH_CLIENT_SECRET=your-client-secret\nOAUTH_CALLBACK_URL=http://localhost:8000/auth/callback\n"
  );
}

async function install_session(projectDir: string): Promise<void> {
  const templateDir = path.resolve(
    __dirname,
    "templates/extras/auth/session"
  );
  await copy_template_files(templateDir, projectDir);

  await append_env_example(
    projectDir,
    "\n# Session Configuration\nSESSION_SECRET=your-super-secret-session-key-change-this\n"
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
