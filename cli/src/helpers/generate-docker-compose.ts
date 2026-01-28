import path from "path";
import fs from "fs-extra";
import { type InstallerOptions, AvailablePackages } from "../types/index.js";

/**
 * Generates a docker-compose.yml file based on selected packages.
 * Includes services for databases, redis, and the main application.
 *
 * @param options - Installer options with selected packages
 */
export async function generate_docker_compose(
  options: InstallerOptions
): Promise<void> {
  const { projectDir, packages, appName, dockerizeDb, dockerizeBackend } = options;

  // Check which services are needed
  const hasPostgres = dockerizeDb && packages.includes(AvailablePackages.postgres);
  const hasMysql = dockerizeDb && packages.includes(AvailablePackages.mysql);
  const hasSqlite = dockerizeDb && packages.includes(AvailablePackages.sqlite);
  const hasMongodb = dockerizeDb && packages.includes(AvailablePackages.mongodb);
  const hasRedis = dockerizeDb && packages.includes(AvailablePackages.redis);

  // Only generate docker-compose if we have any services to include
  if (!dockerizeBackend && !hasPostgres && !hasMysql && !hasSqlite && !hasMongodb && !hasRedis) {
    return;
  }

  let composeContent = `version: '3.8'

services:
`;

  // Add app service (only if dockerizeBackend is true)
  if (dockerizeBackend) {
    composeContent += `  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
`;

    // Add SQLite volume if needed
    if (hasSqlite) {
      composeContent += `    volumes:
      - ./data:/app/data
`;
    }

    // Add depends_on for databases
    const dependencies: string[] = [];
    if (hasPostgres) dependencies.push("postgres");
    if (hasMysql) dependencies.push("mysql");
    if (hasMongodb) dependencies.push("mongodb");
    if (hasRedis) dependencies.push("redis");

    if (dependencies.length > 0) {
      composeContent += `    depends_on:
`;
      dependencies.forEach((dep) => {
        composeContent += `      - ${dep}\n`;
      });
    }
  }

  // Add PostgreSQL service
  if (hasPostgres) {
    composeContent += `
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: \${POSTGRES_USER:-user}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD:-password}
      POSTGRES_DB: \${POSTGRES_DB:-${appName}}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
`;
  }

  // Add MySQL service
  if (hasMysql) {
    composeContent += `
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: \${MYSQL_ROOT_PASSWORD:-rootpassword}
      MYSQL_DATABASE: \${MYSQL_DATABASE:-${appName}}
      MYSQL_USER: \${MYSQL_USER:-user}
      MYSQL_PASSWORD: \${MYSQL_PASSWORD:-password}
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
`;
  }

  // Add MongoDB service
  if (hasMongodb) {
    composeContent += `
  mongodb:
    image: mongo:7.0
    environment:
      MONGO_INITDB_ROOT_USERNAME: \${MONGO_ROOT_USER:-root}
      MONGO_INITDB_ROOT_PASSWORD: \${MONGO_ROOT_PASSWORD:-password}
      MONGO_INITDB_DATABASE: \${MONGO_DATABASE:-${appName}}
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
`;
  }

  // Add Redis service
  if (hasRedis) {
    composeContent += `
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes
`;
  }

  // Add volumes section
  composeContent += `
volumes:
`;

  if (hasPostgres) composeContent += `  postgres_data:\n`;
  if (hasMysql) composeContent += `  mysql_data:\n`;
  if (hasMongodb) composeContent += `  mongodb_data:\n`;
  if (hasRedis) composeContent += `  redis_data:\n`;

  // Write docker-compose.yml
  const dockerComposePath = path.join(projectDir, "docker-compose.yml");
  await fs.writeFile(dockerComposePath, composeContent);
}
