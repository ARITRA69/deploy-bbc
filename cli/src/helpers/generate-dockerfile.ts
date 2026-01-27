import path from "path";
import fs from "fs-extra";
import { type InstallerOptions } from "../types/index.js";

/**
 * Generates a Dockerfile for the project.
 * Uses Bun's official image with multi-stage build for production optimization.
 *
 * @param options - Installer options
 */
export async function generate_dockerfile(
  options: InstallerOptions
): Promise<void> {
  const { projectDir } = options;

  const dockerfileContent = `# Use Bun's official image
FROM oven/bun:1 as base
WORKDIR /app

# Install dependencies
FROM base AS dependencies
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Copy source code
FROM base AS build
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Production image
FROM base AS production
ENV NODE_ENV=production
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app .

# Expose port
EXPOSE 3000

# Run the application
CMD ["bun", "run", "src/index.ts"]
`;

  const dockerfilePath = path.join(projectDir, "Dockerfile");
  await fs.writeFile(dockerfilePath, dockerfileContent);
}
