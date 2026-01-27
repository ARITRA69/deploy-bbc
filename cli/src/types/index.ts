export interface CliFlags {
  noGit: boolean;
  noInstall: boolean;
  default: boolean;
  CI: boolean;
  
  // Database flags
  postgres?: boolean;
  mysql?: boolean;
  mongodb?: boolean;
  redis?: boolean;
  
  // Auth flags
  jwt?: boolean;
  oauth?: boolean;
  session?: boolean;
  
  // AI flags
  openai?: boolean;
  anthropic?: boolean;
  gemini?: boolean;
  vercelAI?: boolean;
  
  // Cloud flags
  aws?: boolean;
  gcp?: boolean;
  azure?: boolean;
  cloudflareR2?: boolean;
  
  // Communication flags
  resend?: boolean;
  sendgrid?: boolean;
  nodemailer?: boolean;
  socketio?: boolean;
  sse?: boolean;
  
  // Infrastructure flags
  bullmq?: boolean;
  inngest?: boolean;
  upstashRateLimit?: boolean;
  customRateLimit?: boolean;
  sentry?: boolean;
  logtail?: boolean;
  
  // DevX flags
  swagger?: boolean;
  scalar?: boolean;
  vitest?: boolean;

  // Validation flags
  zod?: boolean;
  yup?: boolean;
}

export type Framework = "hono" | "express" | "bun-native";

export interface CliResults {
  appName: string;
  framework: Framework;
  packages: AvailablePackages[];
  flags: CliFlags;
}

export enum AvailablePackages {
  // Core
  postgres = "postgres",
  mysql = "mysql",
  mongodb = "mongodb",
  redis = "redis",
  jwt = "jwt",
  oauth = "oauth",
  session = "session",
  
  // AI & ML
  openai = "openai",
  anthropic = "anthropic",
  gemini = "gemini",
  vercelAI = "vercel-ai",
  
  // Cloud & Storage
  aws = "aws",
  gcp = "gcp",
  azure = "azure",
  cloudflareR2 = "cloudflare-r2",
  
  // Communications
  resend = "resend",
  sendgrid = "sendgrid",
  nodemailer = "nodemailer",
  socketio = "socketio",
  sse = "sse",
  
  // Infrastructure
  bullmq = "bullmq",
  inngest = "inngest",
  upstashRateLimit = "upstash-ratelimit",
  customRateLimit = "custom-ratelimit",
  sentry = "sentry",
  logtail = "logtail",
  
  // Developer Experience
  swagger = "swagger",
  scalar = "scalar",
  vitest = "vitest",

  // Validation
  zod = "zod",
  yup = "yup",
}

export interface InstallerOptions {
  projectDir: string;
  packages: AvailablePackages[];
  appName: string;
  framework: Framework;
  noInstall: boolean;
}

export type Installer = (opts: InstallerOptions) => Promise<void>;

export interface PkgInstallerMap {
  [key: string]: {
    inUse: boolean;
    installer: Installer;
  };
}