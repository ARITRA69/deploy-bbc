#!/usr/bin/env node

import { run_cli } from "./cli/index.js";
import { create_project } from "./helpers/create-project.js";
import { logger } from "./utils/logger.js";

async function main() {
  try {
    const cliResults = await run_cli();
    await create_project(cliResults);
  } catch (error) {
    logger.error("\n❌ An error occurred:");
    logger.error(error);
    process.exit(1);
  }
}

main();