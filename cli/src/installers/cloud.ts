import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { type InstallerOptions, AvailablePackages } from "../types/index.js";
import { add_package_dependency } from "../utils/add-package-dependency.js";
import { DEPENDENCY_VERSION_MAP } from "../utils/dependency-version-map.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Cloud installer - handles AWS, GCP, Azure, and Cloudflare R2.
 *
 * @param options - Installer options with selected packages
 */
export async function cloud_installer(
  options: InstallerOptions
): Promise<void> {
  const { projectDir, packages } = options;

  for (const pkg of packages) {
    switch (pkg) {
      case AvailablePackages.aws:
        await install_aws(projectDir);
        break;
      case AvailablePackages.gcp:
        await install_gcp(projectDir);
        break;
      case AvailablePackages.azure:
        await install_azure(projectDir);
        break;
      case AvailablePackages.cloudflareR2:
        await install_cloudflare_r2(projectDir);
        break;
    }
  }
}

async function install_aws(projectDir: string): Promise<void> {
  const templateDir = path.resolve(__dirname, "../templates/extras/cloud/aws");
  await copy_template_files(templateDir, projectDir);

  await add_package_dependency(projectDir, {
    "@aws-sdk/client-s3": DEPENDENCY_VERSION_MAP["@aws-sdk/client-s3"],
    "@aws-sdk/s3-request-presigner":
      DEPENDENCY_VERSION_MAP["@aws-sdk/s3-request-presigner"],
  });

  await append_env_example(
    projectDir,
    "\n# AWS Configuration\nAWS_ACCESS_KEY_ID=your-aws-access-key\nAWS_SECRET_ACCESS_KEY=your-aws-secret-key\nAWS_REGION=us-east-1\nAWS_S3_BUCKET=your-bucket-name\n"
  );
}

async function install_gcp(projectDir: string): Promise<void> {
  const templateDir = path.resolve(__dirname, "../templates/extras/cloud/gcp");
  await copy_template_files(templateDir, projectDir);

  await add_package_dependency(projectDir, {
    "@google-cloud/storage": DEPENDENCY_VERSION_MAP["@google-cloud/storage"],
  });

  await append_env_example(
    projectDir,
    "\n# Google Cloud Platform Configuration\nGCP_PROJECT_ID=your-project-id\nGCP_BUCKET_NAME=your-bucket-name\n# GCP_KEY_FILE=path/to/service-account-key.json\n"
  );
}

async function install_azure(projectDir: string): Promise<void> {
  const templateDir = path.resolve(
    __dirname,
    "../templates/extras/cloud/azure"
  );
  await copy_template_files(templateDir, projectDir);

  await add_package_dependency(projectDir, {
    "@azure/storage-blob": DEPENDENCY_VERSION_MAP["@azure/storage-blob"],
  });

  await append_env_example(
    projectDir,
    "\n# Azure Configuration\nAZURE_STORAGE_CONNECTION_STRING=your-connection-string\nAZURE_STORAGE_CONTAINER=your-container-name\n"
  );
}

async function install_cloudflare_r2(projectDir: string): Promise<void> {
  const templateDir = path.resolve(
    __dirname,
    "../templates/extras/cloud/cloudflare-r2"
  );
  await copy_template_files(templateDir, projectDir);

  await add_package_dependency(projectDir, {
    "@aws-sdk/client-s3": DEPENDENCY_VERSION_MAP["@aws-sdk/client-s3"],
  });

  await append_env_example(
    projectDir,
    "\n# Cloudflare R2 Configuration\nCLOUDFLARE_ACCOUNT_ID=your-account-id\nCLOUDFLARE_ACCESS_KEY_ID=your-access-key\nCLOUDFLARE_SECRET_ACCESS_KEY=your-secret-key\nCLOUDFLARE_R2_BUCKET=your-bucket-name\n"
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
