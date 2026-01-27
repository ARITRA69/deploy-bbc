import {
  type InstallerOptions,
  type PkgInstallerMap,
  type Installer,
  AvailablePackages,
} from "../types/index.js";
import { base_installer } from "./base.js";
import { database_installer } from "./database.js";
import { auth_installer } from "./auth.js";
import { ai_installer } from "./ai.js";
import { email_installer } from "./email.js";
import { cloud_installer } from "./cloud.js";
import { realtime_installer } from "./realtime.js";
import { queue_installer } from "./queue.js";
import { ratelimit_installer } from "./ratelimit.js";
import { observability_installer } from "./observability.js";
import { docs_installer } from "./docs.js";
import { testing_installer } from "./testing.js";
import { validation_installer } from "./validation.js";
import { env_variables_installer } from "./env-variables.js";

/**
 * Builds a map of installers based on selected packages.
 * Each installer is marked as inUse if any of its related packages are selected.
 *
 * @param options - Installer options with selected packages
 * @returns Map of installers with usage flags
 */
export function build_installer_map(
  options: InstallerOptions
): PkgInstallerMap {
  const { packages } = options;

  // Helper to check if any package in a category is selected
  const has_package = (...pkgs: AvailablePackages[]): boolean => {
    return pkgs.some((pkg) => packages.includes(pkg));
  };

  return {
    base: {
      inUse: true, // Always run base installer
      installer: base_installer,
    },
    database: {
      inUse: has_package(
        AvailablePackages.postgres,
        AvailablePackages.mysql,
        AvailablePackages.mongodb,
        AvailablePackages.redis
      ),
      installer: database_installer,
    },
    auth: {
      inUse: has_package(
        AvailablePackages.jwt,
        AvailablePackages.oauth,
        AvailablePackages.session
      ),
      installer: auth_installer,
    },
    ai: {
      inUse: has_package(
        AvailablePackages.openai,
        AvailablePackages.anthropic,
        AvailablePackages.gemini,
        AvailablePackages.vercelAI
      ),
      installer: ai_installer,
    },
    email: {
      inUse: has_package(
        AvailablePackages.resend,
        AvailablePackages.sendgrid,
        AvailablePackages.nodemailer
      ),
      installer: email_installer,
    },
    cloud: {
      inUse: has_package(
        AvailablePackages.aws,
        AvailablePackages.gcp,
        AvailablePackages.azure,
        AvailablePackages.cloudflareR2
      ),
      installer: cloud_installer,
    },
    realtime: {
      inUse: has_package(AvailablePackages.socketio, AvailablePackages.sse),
      installer: realtime_installer,
    },
    queue: {
      inUse: has_package(AvailablePackages.bullmq, AvailablePackages.inngest),
      installer: queue_installer,
    },
    ratelimit: {
      inUse: has_package(
        AvailablePackages.upstashRateLimit,
        AvailablePackages.customRateLimit
      ),
      installer: ratelimit_installer,
    },
    observability: {
      inUse: has_package(AvailablePackages.sentry, AvailablePackages.logtail),
      installer: observability_installer,
    },
    docs: {
      inUse: has_package(AvailablePackages.swagger, AvailablePackages.scalar),
      installer: docs_installer,
    },
    testing: {
      inUse: has_package(AvailablePackages.vitest),
      installer: testing_installer,
    },
    validation: {
      inUse: has_package(AvailablePackages.zod, AvailablePackages.yup),
      installer: validation_installer,
    },
    envVariables: {
      inUse: true, // Always run to create .env files
      installer: env_variables_installer,
    },
  };
}

/**
 * Executes all installers marked as inUse sequentially.
 * Each installer is responsible for copying templates and adding dependencies.
 *
 * @param installerMap - Map of installers with usage flags
 * @param options - Installer options
 */
export async function run_installers(
  installerMap: PkgInstallerMap,
  options: InstallerOptions
): Promise<void> {
  // Get list of active installers
  const installers = Object.entries(installerMap)
    .filter(([_, config]) => config.inUse)
    .map(([_, config]) => config.installer);

  // Run each installer sequentially
  for (const installer of installers) {
    await installer(options);
  }
}
