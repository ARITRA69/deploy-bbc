import * as p from "@clack/prompts";
import chalk from "chalk";
import { Command } from "commander";
import { type CliFlags, type CliResults, AvailablePackages } from "../types/index.js";

const defaultOptions: CliFlags = {
  noGit: false,
  noInstall: false,
  default: false,
  CI: false,
};

export const run_cli = async (): Promise<CliResults> => {
  const program = new Command()
    .name("deploy-bbc")
    .description("Bootstrap a production-ready backend with Bun")
    .argument("[dir]", "The name of the application")
    .option("--noGit", "Skip git initialization", defaultOptions.noGit)
    .option("--noInstall", "Skip dependency installation", defaultOptions.noInstall)
    .option("--default", "Use default options", defaultOptions.default)
    // CI Mode
    .option("--CI", "Run in CI mode (non-interactive)", defaultOptions.CI)
    // Framework options
    .option("--hono", "Use Hono framework (default)")
    .option("--express", "Use Express framework")
    .option("--bun-native", "Use Bun native HTTP server")
    // Database options
    .option("--postgres", "Include PostgreSQL")
    .option("--mysql", "Include MySQL")
    .option("--mongodb", "Include MongoDB")
    .option("--redis", "Include Redis")
    // Auth options
    .option("--jwt", "Include JWT authentication")
    .option("--oauth", "Include OAuth 2.0")
    .option("--session", "Include session-based auth")
    // AI options
    .option("--openai", "Include OpenAI SDK")
    .option("--anthropic", "Include Anthropic Claude SDK")
    .option("--gemini", "Include Google Gemini SDK")
    .option("--vercelAI", "Include Vercel AI SDK")
    // Cloud options
    .option("--aws", "Include AWS SDK")
    .option("--gcp", "Include Google Cloud SDK")
    .option("--azure", "Include Azure SDK")
    .option("--cloudflareR2", "Include Cloudflare R2")
    // Communication options
    .option("--resend", "Include Resend email service")
    .option("--sendgrid", "Include SendGrid")
    .option("--nodemailer", "Include NodeMailer")
    .option("--socketio", "Include Socket.io")
    .option("--sse", "Include Server-Sent Events")
    // Infrastructure options
    .option("--bullmq", "Include BullMQ")
    .option("--inngest", "Include Inngest")
    .option("--upstashRateLimit", "Include Upstash Rate Limit")
    .option("--customRateLimit", "Include custom rate limiting")
    .option("--sentry", "Include Sentry")
    .option("--logtail", "Include LogTail")
    // DevX options
    .option("--swagger", "Include Swagger/OpenAPI")
    .option("--scalar", "Include Scalar API docs")
    .option("--vitest", "Include Vitest testing")
    // Validation options
    .option("--zod", "Include Zod validation")
    .option("--yup", "Include Yup validation")
    .parse(process.argv);

  const cliProvidedName = program.args[0];
  const cliOptions = program.opts<CliFlags>();

  // CI Mode - skip interactive prompts
  if (cliOptions.CI) {
    return build_from_flags(cliProvidedName, cliOptions);
  }

  // Interactive Mode
  const intro = `
╔═══════════════════════════════════════════════╗
║                                               ║
║     🚀  deploy-bbc                            ║
║         (Best Backend Code)                   ║
║                                               ║
║     Bootstrap a production-ready backend      ║
║     with Bun, TypeScript & Docker             ║
║                                               ║
╚═══════════════════════════════════════════════╝
  `;

  console.log(chalk.cyan(intro));

  p.intro(chalk.bgCyan(chalk.black(" deploy-bbc ")));

  const project = await p.group(
    {
      // ──────────────────────────────────────────
      // 📦 CORE
      // ──────────────────────────────────────────
      ...add_cli_header("📦 CORE"),

      projectName: () =>
        p.text({
          message: "What will your project be called?",
          placeholder: "my-awesome-api (or . for current directory)",
          defaultValue: cliProvidedName || "my-backend",
          validate: (value) => {
            if (!value) return "Please enter a project name";
            // Allow '.' for current directory or paths
            if (value === "." || value.startsWith("./") || value.startsWith("../") || value.startsWith("~/")) {
              return; // Valid path
            }
            // Otherwise check for valid name format
            if (!/^[a-z0-9-_/]+$/i.test(value))
              return "Only letters, numbers, dashes, underscores, and slashes";
          },
        }),

      framework: () =>
        p.select<any, "hono" | "express" | "bun-native">({
          message: "Which framework would you like to use?",
          options: [
            {
              value: "hono",
              label: "Hono",
              hint: "Ultrafast web framework (recommended)",
            },
            {
              value: "express",
              label: "Express",
              hint: "Battle-tested Node.js framework",
            },
            {
              value: "bun-native",
              label: "Bun Native",
              hint: "Native Bun.serve() API",
            },
          ],
          initialValue: "hono",
        }),

      databases: () =>
        p.multiselect({
          message: "Which database(s) would you like to use?",
          options: [
            {
              value: AvailablePackages.postgres,
              label: "PostgreSQL",
              hint: "Dockerized • Drizzle ORM",
            },
            {
              value: AvailablePackages.mysql,
              label: "MySQL",
              hint: "Dockerized • Drizzle ORM",
            },
            {
              value: AvailablePackages.mongodb,
              label: "MongoDB",
              hint: "Not dockerized • Mongoose",
            },
            {
              value: AvailablePackages.redis,
              label: "Redis",
              hint: "Dockerized • Caching & Sessions",
            },
          ],
          required: false,
        }),

      auth: () =>
        p.multiselect({
          message: "Select authentication methods:",
          options: [
            {
              value: AvailablePackages.jwt,
              label: "JWT Token Auth",
              hint: "Stateless tokens",
            },
            {
              value: AvailablePackages.oauth,
              label: "OAuth 2.0",
              hint: "Google, GitHub, etc.",
            },
            {
              value: AvailablePackages.session,
              label: "Session-based Auth",
              hint: "Requires Redis",
            },
          ],
          required: false,
        }),

      // ──────────────────────────────────────────
      // 🤖 AI & ML
      // ──────────────────────────────────────────
      ...add_cli_header("🤖 AI & ML"),

      aiProviders: () =>
        p.multiselect({
          message: "AI Providers: (select all that apply)",
          options: [
            {
              value: AvailablePackages.openai,
              label: "OpenAI",
              hint: "GPT-4, DALL-E, Whisper",
            },
            {
              value: AvailablePackages.anthropic,
              label: "Anthropic Claude",
              hint: "Claude 3.5 Sonnet",
            },
            {
              value: AvailablePackages.gemini,
              label: "Google Gemini",
              hint: "Gemini Pro",
            },
            { value: "none", label: "None", hint: "Skip AI integration" },
          ],
          required: false,
        }),

      vercelAI: ({ results }) => {
        const hasAI =
          results.aiProviders?.length && results.aiProviders.length > 0 &&
          !results.aiProviders?.includes("none");

        if (!hasAI) return Promise.resolve(false);

        return p.confirm({
          message: "Use Vercel AI SDK for unified interface?",
          initialValue: true,
        });
      },

      // ──────────────────────────────────────────
      // 📧 COMMUNICATIONS
      // ──────────────────────────────────────────
      ...add_cli_header("📧 COMMUNICATIONS"),

      emailService: () =>
        p.select<any, AvailablePackages | "none">({
          message: "Email service:",
          options: [
            {
              value: AvailablePackages.resend,
              label: "Resend",
              hint: "Modern, developer-first",
            },
            {
              value: AvailablePackages.sendgrid,
              label: "SendGrid",
              hint: "Enterprise-grade",
            },
            {
              value: AvailablePackages.nodemailer,
              label: "NodeMailer (SMTP)",
              hint: "Self-hosted",
            },
            { value: "none", label: "None" },
          ],
          initialValue: "none",
        }),

      realtime: () =>
        p.select<any, AvailablePackages | "none">({
          message: "Real-time capabilities:",
          options: [
            {
              value: AvailablePackages.socketio,
              label: "Socket.io",
              hint: "WebSockets + fallbacks",
            },
            {
              value: AvailablePackages.sse,
              label: "Server-Sent Events (SSE)",
              hint: "Native, unidirectional",
            },
            { value: "none", label: "None" },
          ],
          initialValue: "none",
        }),

      // ──────────────────────────────────────────
      // 🔧 INFRASTRUCTURE
      // ──────────────────────────────────────────
      ...add_cli_header("🔧 INFRASTRUCTURE"),

      backgroundJobs: () =>
        p.select<any, AvailablePackages | "none">({
          message: "Background jobs & queues:",
          options: [
            {
              value: AvailablePackages.bullmq,
              label: "BullMQ",
              hint: "Redis-based, feature-rich",
            },
            {
              value: AvailablePackages.inngest,
              label: "Inngest",
              hint: "Serverless-first, durable",
            },
            { value: "none", label: "None" },
          ],
          initialValue: "none",
        }),

      // ──────────────────────────────────────────
      // 📚 DEVELOPER EXPERIENCE
      // ──────────────────────────────────────────
      ...add_cli_header("📚 DEVELOPER EXPERIENCE"),

      apiDocs: () =>
        p.select<any, AvailablePackages | "none">({
          message: "API Documentation:",
          options: [
            {
              value: AvailablePackages.swagger,
              label: "Swagger/OpenAPI",
              hint: "Industry standard",
            },
            {
              value: AvailablePackages.scalar,
              label: "Scalar",
              hint: "Modern, beautiful UI",
            },
            { value: "none", label: "None" },
          ],
          initialValue: AvailablePackages.swagger,
        }),

      testing: () =>
        p.confirm({
          message: "Set up testing with Vitest?",
          initialValue: true,
        }),

      validation: () =>
        p.select<any, AvailablePackages | "none">({
          message: "Request validation library:",
          options: [
            {
              value: AvailablePackages.zod,
              label: "Zod",
              hint: "TypeScript-first, lightweight",
            },
            {
              value: AvailablePackages.yup,
              label: "Yup",
              hint: "Schema builder, runtime validation",
            },
            { value: "none", label: "None" },
          ],
          initialValue: AvailablePackages.zod,
        }),

      installDeps: () =>
        p.confirm({
          message: "Install dependencies?",
          initialValue: !cliOptions.noInstall,
        }),

      initGit: () =>
        p.confirm({
          message: "Initialize git repository?",
          initialValue: !cliOptions.noGit,
        }),
    },
    {
      onCancel: () => {
        p.cancel("Operation cancelled");
        process.exit(0);
      },
    }
  );

  // Build packages array
  const aiPackages = (project.aiProviders as (AvailablePackages | string)[] | undefined)?.filter(p => p !== "none") as AvailablePackages[] || [];
  const packages: AvailablePackages[] = [
    ...(project.databases || []),
    ...(project.auth || []),
    ...aiPackages,
    project.vercelAI ? AvailablePackages.vercelAI : null,
    typeof project.emailService === "string" && project.emailService !== "none" ? project.emailService as AvailablePackages : null,
    typeof project.realtime === "string" && project.realtime !== "none" ? project.realtime as AvailablePackages : null,
    typeof project.backgroundJobs === "string" && project.backgroundJobs !== "none" ? project.backgroundJobs as AvailablePackages : null,
    typeof project.apiDocs === "string" && project.apiDocs !== "none" ? project.apiDocs as AvailablePackages : null,
    project.testing ? AvailablePackages.vitest : null,
    typeof project.validation === "string" && project.validation !== "none" ? project.validation as AvailablePackages : null,
  ].filter(Boolean) as AvailablePackages[];

  return {
    appName: project.projectName as string,
    framework: project.framework as "hono" | "express" | "bun-native",
    packages,
    flags: {
      ...defaultOptions,
      noInstall: !project.installDeps,
      noGit: !project.initGit,
    },
  };
};

// Helper to add section headers
function add_cli_header(title: string) {
  return {
    [`_${title.replace(/[^a-zA-Z0-9]/g, "")}`]: () => {
      console.log(chalk.bold.cyan(`\n${title}`));
      return Promise.resolve();
    },
  };
}

// Build project from CLI flags (CI mode)
function build_from_flags(
  appName: string | undefined,
  flags: CliFlags & { hono?: boolean; express?: boolean; "bun-native"?: boolean }
): CliResults {
  const packages: AvailablePackages[] = [];

  // Determine framework
  let framework: "hono" | "express" | "bun-native" = "hono";
  if (flags.express) framework = "express";
  else if (flags["bun-native"]) framework = "bun-native";

  // Add packages based on flags
  if (flags.postgres) packages.push(AvailablePackages.postgres);
  if (flags.mysql) packages.push(AvailablePackages.mysql);
  if (flags.mongodb) packages.push(AvailablePackages.mongodb);
  if (flags.redis) packages.push(AvailablePackages.redis);
  if (flags.jwt) packages.push(AvailablePackages.jwt);
  if (flags.oauth) packages.push(AvailablePackages.oauth);
  if (flags.session) packages.push(AvailablePackages.session);
  if (flags.openai) packages.push(AvailablePackages.openai);
  if (flags.anthropic) packages.push(AvailablePackages.anthropic);
  if (flags.gemini) packages.push(AvailablePackages.gemini);
  if (flags.vercelAI) packages.push(AvailablePackages.vercelAI);
  if (flags.resend) packages.push(AvailablePackages.resend);
  if (flags.sendgrid) packages.push(AvailablePackages.sendgrid);
  if (flags.nodemailer) packages.push(AvailablePackages.nodemailer);
  if (flags.socketio) packages.push(AvailablePackages.socketio);
  if (flags.sse) packages.push(AvailablePackages.sse);
  if (flags.bullmq) packages.push(AvailablePackages.bullmq);
  if (flags.inngest) packages.push(AvailablePackages.inngest);
  if (flags.swagger) packages.push(AvailablePackages.swagger);
  if (flags.scalar) packages.push(AvailablePackages.scalar);
  if (flags.vitest) packages.push(AvailablePackages.vitest);
  if (flags.zod) packages.push(AvailablePackages.zod);
  if (flags.yup) packages.push(AvailablePackages.yup);

  return {
    appName: appName || "my-backend",
    framework,
    packages,
    flags,
  };
}