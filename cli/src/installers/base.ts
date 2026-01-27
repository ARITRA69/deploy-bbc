import { type InstallerOptions } from "../types/index.js";

/**
 * Base installer - handles any base setup that's not covered by scaffold_project.
 * Currently minimal since scaffold_project handles most base template copying.
 *
 * @param options - Installer options
 */
export async function base_installer(
  _options: InstallerOptions
): Promise<void> {
  // Base setup is handled by scaffold_project
  // This installer exists for any additional base configuration
  // that might be needed in the future
  return Promise.resolve();
}
