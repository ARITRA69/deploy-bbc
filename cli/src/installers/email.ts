import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { type InstallerOptions, AvailablePackages } from "../types/index.js";
import { add_package_dependency } from "../utils/add-package-dependency.js";
import { DEPENDENCY_VERSION_MAP } from "../utils/dependency-version-map.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Email installer - handles Resend, SendGrid, and Nodemailer.
 *
 * @param options - Installer options with selected packages
 */
export async function email_installer(
  options: InstallerOptions
): Promise<void> {
  const { projectDir, packages } = options;

  for (const pkg of packages) {
    switch (pkg) {
      case AvailablePackages.resend:
        await install_resend(projectDir);
        break;
      case AvailablePackages.sendgrid:
        await install_sendgrid(projectDir);
        break;
      case AvailablePackages.nodemailer:
        await install_nodemailer(projectDir);
        break;
    }
  }
}

async function install_resend(projectDir: string): Promise<void> {
  const templateDir = path.resolve(
    __dirname,
    "../templates/extras/email/resend"
  );
  await copy_template_files(templateDir, projectDir);

  await add_package_dependency(projectDir, {
    resend: DEPENDENCY_VERSION_MAP["resend"],
  });

  await append_env_example(
    projectDir,
    "\n# Resend Configuration\nRESEND_API_KEY=your-resend-api-key\n"
  );
}

async function install_sendgrid(projectDir: string): Promise<void> {
  const templateDir = path.resolve(
    __dirname,
    "../templates/extras/email/sendgrid"
  );
  await copy_template_files(templateDir, projectDir);

  await add_package_dependency(projectDir, {
    "@sendgrid/mail": DEPENDENCY_VERSION_MAP["@sendgrid/mail"],
  });

  await append_env_example(
    projectDir,
    "\n# SendGrid Configuration\nSENDGRID_API_KEY=your-sendgrid-api-key\nSENDGRID_FROM_EMAIL=noreply@yourdomain.com\n"
  );
}

async function install_nodemailer(projectDir: string): Promise<void> {
  const templateDir = path.resolve(
    __dirname,
    "../templates/extras/email/nodemailer"
  );
  await copy_template_files(templateDir, projectDir);

  await add_package_dependency(projectDir, {
    nodemailer: DEPENDENCY_VERSION_MAP["nodemailer"],
  });

  await add_package_dependency(
    projectDir,
    {},
    {
      "@types/nodemailer": DEPENDENCY_VERSION_MAP["@types/nodemailer"],
    }
  );

  await append_env_example(
    projectDir,
    "\n# Nodemailer Configuration\nSMTP_HOST=smtp.example.com\nSMTP_PORT=587\nSMTP_USER=your-smtp-username\nSMTP_PASS=your-smtp-password\nSMTP_FROM=noreply@yourdomain.com\n"
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
}

async function append_env_example(
  projectDir: string,
  content: string
): Promise<void> {
  const envPath = path.join(projectDir, ".env.example");
  await fs.appendFile(envPath, content);
}
