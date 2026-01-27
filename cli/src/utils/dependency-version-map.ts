/**
 * Central registry mapping package names to their versions.
 * Single source of truth for all dependency versions used in generated projects.
 */
export const DEPENDENCY_VERSION_MAP: Record<string, string> = {
  // Core Framework
  "hono": "^4.0.0",
  "express": "^4.18.2",
  "@types/express": "^4.17.21",

  // Database Drivers
  "postgres": "^3.4.4",
  "mysql2": "^3.9.0",
  "mongoose": "^8.1.0",
  "redis": "^4.6.12",

  // ORM & Query Builders
  "drizzle-orm": "^0.29.3",
  "drizzle-kit": "^0.20.10",
  "kysely": "^0.27.2",

  // Authentication
  "jsonwebtoken": "^9.0.2",
  "@types/jsonwebtoken": "^9.0.5",
  "bcryptjs": "^2.4.3",
  "@types/bcryptjs": "^2.4.6",
  "passport": "^0.7.0",
  "passport-oauth2": "^1.8.0",
  "@types/passport": "^1.0.16",

  // AI Providers
  "openai": "^4.26.0",
  "@anthropic-ai/sdk": "^0.12.0",
  "@google/generative-ai": "^0.1.3",
  "ai": "^3.0.0",

  // Cloud Storage
  "@aws-sdk/client-s3": "^3.490.0",
  "@aws-sdk/s3-request-presigner": "^3.490.0",
  "@google-cloud/storage": "^7.7.0",
  "@azure/storage-blob": "^12.17.0",
  "@cloudflare/workers-types": "^4.20240117.0",

  // Email Services
  "resend": "^3.0.0",
  "@sendgrid/mail": "^8.1.0",
  "nodemailer": "^6.9.8",
  "@types/nodemailer": "^6.4.14",

  // Real-time Communication
  "socket.io": "^4.6.1",
  "@types/socket.io": "^3.0.0",

  // Queue Systems
  "bullmq": "^5.1.5",
  "inngest": "^3.12.0",

  // Rate Limiting
  "@upstash/ratelimit": "^1.0.0",
  "@upstash/redis": "^1.27.1",

  // Observability
  "@sentry/node": "^7.99.0",
  "@logtail/node": "^0.4.13",

  // API Documentation
  "@hono/swagger": "^0.1.0",
  "@scalar/hono-api-reference": "^0.5.0",

  // Testing
  "vitest": "^1.2.0",
  "@vitest/ui": "^1.2.0",
  "supertest": "^6.3.4",
  "@types/supertest": "^6.0.2",

  // Utilities
  "zod": "^3.22.4",
  "yup": "^1.3.3",
  "dotenv": "^16.3.1",
  "cors": "^2.8.5",
  "@types/cors": "^2.8.17",
  "helmet": "^7.1.0",
  "compression": "^1.7.4",
  "@types/compression": "^1.7.5",
};
