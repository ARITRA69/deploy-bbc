import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { type InstallerOptions, AvailablePackages } from "../types/index.js";
import { add_package_dependency } from "../utils/add-package-dependency.js";
import { DEPENDENCY_VERSION_MAP } from "../utils/dependency-version-map.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * AI installer - handles OpenAI, Anthropic, Gemini, and Vercel AI SDK.
 *
 * @param options - Installer options with selected packages
 */
export async function ai_installer(options: InstallerOptions): Promise<void> {
  const { projectDir, packages } = options;

  for (const pkg of packages) {
    switch (pkg) {
      case AvailablePackages.openai:
        await install_openai(projectDir);
        break;
      case AvailablePackages.anthropic:
        await install_anthropic(projectDir);
        break;
      case AvailablePackages.gemini:
        await install_gemini(projectDir);
        break;
      case AvailablePackages.vercelAI:
        await install_vercel_ai(projectDir);
        break;
    }
  }
}

async function install_openai(projectDir: string): Promise<void> {
  const templateDir = path.resolve(__dirname, "templates/extras/ai/openai");
  await copy_template_files(templateDir, projectDir);

  await add_package_dependency(projectDir, {
    openai: DEPENDENCY_VERSION_MAP["openai"],
  });

  await append_env_example(
    projectDir,
    "\n# OpenAI Configuration\nOPENAI_API_KEY=your-openai-api-key\n"
  );
}

async function install_anthropic(projectDir: string): Promise<void> {
  const templateDir = path.resolve(
    __dirname,
    "templates/extras/ai/anthropic"
  );
  await copy_template_files(templateDir, projectDir);

  await add_package_dependency(projectDir, {
    "@anthropic-ai/sdk": DEPENDENCY_VERSION_MAP["@anthropic-ai/sdk"],
  });

  await append_env_example(
    projectDir,
    "\n# Anthropic Configuration\nANTHROPIC_API_KEY=your-anthropic-api-key\n"
  );
}

async function install_gemini(projectDir: string): Promise<void> {
  const templateDir = path.resolve(__dirname, "templates/extras/ai/gemini");
  await copy_template_files(templateDir, projectDir);

  await add_package_dependency(projectDir, {
    "@google/generative-ai": DEPENDENCY_VERSION_MAP["@google/generative-ai"],
  });

  await append_env_example(
    projectDir,
    "\n# Google Gemini Configuration\nGEMINI_API_KEY=your-gemini-api-key\n"
  );
}

async function install_vercel_ai(projectDir: string): Promise<void> {
  const templateDir = path.resolve(
    __dirname,
    "templates/extras/ai/vercel-ai"
  );
  await copy_template_files(templateDir, projectDir);

  await add_package_dependency(projectDir, {
    ai: DEPENDENCY_VERSION_MAP["ai"],
  });

  await append_env_example(
    projectDir,
    "\n# Vercel AI SDK Configuration\n# Add API keys for the providers you want to use with Vercel AI\n"
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
