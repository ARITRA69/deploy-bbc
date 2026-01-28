# 🚀 deploy-bbc (Best Backend Code)

Bootstrap production-ready backend projects with Bun, TypeScript, and Docker in seconds.

[![npm version](https://img.shields.io/npm/v/deploy-bbc.svg)](https://www.npmjs.com/package/deploy-bbc)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🎯 **Interactive CLI** - Step-by-step project setup with beautiful prompts
- ⚡ **3 Framework Options** - Choose between Hono, Express, or Bun Native
- 🗄️ **Multiple Databases** - PostgreSQL, MySQL, MongoDB, Redis with Drizzle ORM/Mongoose
- 🔐 **Authentication** - JWT, OAuth 2.0, Session-based auth
- 🤖 **AI Integration** - OpenAI, Anthropic Claude, Google Gemini, Vercel AI SDK
- ☁️ **Cloud Storage** - AWS S3, Google Cloud, Azure, Cloudflare R2
- 📧 **Email Services** - Resend, SendGrid, NodeMailer
- 🔄 **Real-time** - Socket.io, Server-Sent Events
- 📝 **Validation** - Zod or Yup for request validation
- 📊 **Background Jobs** - BullMQ, Inngest
- 📚 **API Documentation** - Swagger/OpenAPI, Scalar
- 🧪 **Testing** - Vitest with Supertest
- 🐳 **Docker Ready** - Dockerfile + docker-compose.yml included
- 📦 **TypeScript** - Full type safety out of the box

## 🚀 Quick Start

```bash
# Using npx (recommended)
npx deploy-bbc my-awesome-api

# Using npm
npm create deploy-bbc my-awesome-api

# Using bun
bunx deploy-bbc my-awesome-api
```

## 📦 Installation

```bash
# Install globally
npm install -g deploy-bbc

# Use directly with npx
npx deploy-bbc
```

## 🎨 Usage

### Interactive Mode

Simply run the command and follow the prompts:

```bash
npx deploy-bbc my-project
```

You'll be asked to select:
1. **Project name** - Your application name
2. **Framework** - Hono (recommended), Express, or Bun Native
3. **Database(s)** - PostgreSQL, MySQL, MongoDB, Redis
4. **Authentication** - JWT, OAuth, Session-based
5. **AI Providers** - OpenAI, Anthropic, Gemini
6. **Email Service** - Resend, SendGrid, NodeMailer
7. **Real-time** - Socket.io or SSE
8. **Background Jobs** - BullMQ or Inngest
9. **Validation** - Zod or Yup
10. **API Docs** - Swagger or Scalar
11. **Testing** - Vitest setup

### CI Mode (Non-Interactive)

Perfect for automated deployments:

```bash
npx deploy-bbc my-project \
  --CI \
  --express \
  --postgres \
  --redis \
  --jwt \
  --zod \
  --vitest \
  --swagger \
  --noGit
```

## 🛠️ Framework Options

### Hono (Default)
```bash
npx deploy-bbc my-app --hono
```
- Ultrafast web framework built for the edge
- Tiny footprint (~12KB)
- Express-like API
- **Recommended for most projects**

### Express
```bash
npx deploy-bbc my-app --express
```
- Battle-tested Node.js framework
- Huge ecosystem
- Familiar to most developers

### Bun Native
```bash
npx deploy-bbc my-app --bun-native
```
- Native Bun.serve() API
- Zero dependencies
- Maximum performance

## 📊 Available Packages

### Databases
- `--postgres` - PostgreSQL with Drizzle ORM
- `--mysql` - MySQL with Drizzle ORM
- `--mongodb` - MongoDB with Mongoose
- `--redis` - Redis for caching & sessions

### Authentication
- `--jwt` - JSON Web Token authentication
- `--oauth` - OAuth 2.0 (Google, GitHub)
- `--session` - Session-based auth (requires Redis)

### AI & ML
- `--openai` - OpenAI GPT models
- `--anthropic` - Anthropic Claude SDK
- `--gemini` - Google Gemini
- `--vercelAI` - Vercel AI SDK (unified interface)

### Cloud Storage
- `--aws` - AWS S3 & SES
- `--gcp` - Google Cloud Storage
- `--azure` - Azure Blob Storage
- `--cloudflareR2` - Cloudflare R2

### Communication
- `--resend` - Modern email service
- `--sendgrid` - Enterprise email
- `--nodemailer` - SMTP email
- `--socketio` - WebSockets
- `--sse` - Server-Sent Events

### Infrastructure
- `--bullmq` - Redis-based job queue
- `--inngest` - Serverless job orchestration
- `--upstashRateLimit` - Upstash rate limiting
- `--customRateLimit` - Custom rate limit middleware
- `--sentry` - Error tracking
- `--logtail` - Log aggregation

### Developer Experience
- `--swagger` - Swagger/OpenAPI docs
- `--scalar` - Modern API documentation
- `--vitest` - Testing framework
- `--zod` - Zod validation
- `--yup` - Yup validation

### Options
- `--noInstall` - Skip dependency installation
- `--noGit` - Skip git initialization
- `--CI` - Non-interactive mode

## 📝 Examples

### Full-Stack API with PostgreSQL + JWT + AI
```bash
npx deploy-bbc my-api \
  --hono \
  --postgres \
  --redis \
  --jwt \
  --openai \
  --zod \
  --swagger \
  --vitest
```

### Microservice with Express + MongoDB
```bash
npx deploy-bbc user-service \
  --express \
  --mongodb \
  --session \
  --resend \
  --bullmq \
  --sentry
```

### Minimal Bun Native API
```bash
npx deploy-bbc fast-api \
  --bun-native \
  --postgres \
  --jwt \
  --zod
```

### AI-Powered Backend
```bash
npx deploy-bbc ai-backend \
  --hono \
  --postgres \
  --jwt \
  --anthropic \
  --vercelAI \
  --aws \
  --zod \
  --scalar
```

## 🏗️ Project Structure

```
my-project/
├── src/
│   ├── index.ts              # Application entry point
│   ├── config/               # Configuration
│   ├── middleware/           # Custom middleware
│   ├── routes/               # API routes
│   ├── types/                # TypeScript types
│   └── utils/                # Utility functions
├── docker-compose.yml        # Docker services
├── Dockerfile                # Container configuration
├── .env.example              # Environment variables template
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
└── README.md                 # Project documentation
```

## 🚦 Getting Started with Your Project

After creating your project:

```bash
# Navigate to project
cd my-project

# Copy environment variables
cp .env.example .env

# Edit .env with your credentials
nano .env

# Start development server
bun run dev

# Start with Docker
docker-compose up -d
bun run dev

# Run tests
bun test

# Build for production
bun run build
```

## 🔧 Validation Example (Zod)

When you select Zod validation, you get ready-to-use middleware:

```typescript
import { z } from "zod";
import { validate, get_validated } from "./middleware/validate.js";

const create_user_schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  age: z.number().int().min(18).optional(),
});

app.post(
  "/users",
  validate({ target: "body", schema: create_user_schema }),
  (c) => {
    const body = get_validated(c, "body");
    // body is fully typed and validated
    return c.json({ user: body });
  }
);
```

## 🐳 Docker Support

Every project includes:
- **Dockerfile** - Optimized multi-stage build
- **docker-compose.yml** - Services orchestration
- Database containers (PostgreSQL, MySQL, Redis)
- Volume persistence
- Network configuration

Start everything with:
```bash
docker-compose up -d
```

## 📚 Documentation

Each generated project includes:
- Comprehensive README.md
- .env.example with all required variables
- Example routes and middleware
- TypeScript types and interfaces
- Docker setup instructions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT © [Aritra Sarkar](https://github.com/aritra69)

## 🙏 Acknowledgments

Built with:
- [Bun](https://bun.sh) - Fast JavaScript runtime
- [Hono](https://hono.dev) - Ultrafast web framework
- [Clack](https://github.com/natemoo-re/clack) - Beautiful CLI prompts
- [Drizzle ORM](https://orm.drizzle.team) - TypeScript ORM
- [Zod](https://zod.dev) - TypeScript-first validation

## 🔗 Links

- [GitHub Repository](https://github.com/aritra69/deploy-bbc)
- [npm Package](https://www.npmjs.com/package/deploy-bbc)
- [Report Issues](https://github.com/aritra69/deploy-bbc/issues)

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

**Made with ❤️ by [Aritra Sarkar](https://github.com/aritra69)**
