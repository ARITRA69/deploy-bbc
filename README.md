# deploy-bbc

> A powerful CLI tool to bootstrap production-ready backend applications with Bun

## Overview

`deploy-bbc` (Best Backend Code) is an interactive command-line tool that scaffolds modern, type-safe backend applications using Bun. It provides a comprehensive set of integrations for databases, authentication, AI services, cloud providers, and more - all configured and ready to use.

## Features

- **Three Framework Options**: Choose between Hono, Express, or Bun Native HTTP
- **Production-Ready Templates**: Pre-configured with best practices and error handling
- **30+ Integrations**: Databases, auth, AI, cloud storage, queues, and more
- **Type-Safe**: Full TypeScript support with strict typing
- **Docker Ready**: Automatic Dockerfile and docker-compose generation
- **Developer Experience**: Built-in validation, testing, and API documentation options
- **Zero Config**: Works out of the box with sensible defaults

## Quick Start

```bash
# Using npx (recommended)
npx deploy-bbc my-backend

# Using bun
bunx deploy-bbc my-backend

# Using npm
npm create backend-app my-backend
```

Follow the interactive prompts to select your framework and integrations.

## Installation

### As a CLI Tool

```bash
# Install globally
npm install -g deploy-bbc

# Run
deploy-bbc my-app-name
```

### From Source

```bash
# Clone the repository
git clone https://github.com/aritra69/deploy-bbc.git
cd deploy-bbc

# Install dependencies
bun install

# Build
bun run build

# Link for local development
npm link
```

## Usage

### Interactive Mode

Simply run the CLI and answer the prompts:

```bash
deploy-bbc my-backend
```

You'll be prompted to:

1. Choose a framework (Hono, Express, or Bun Native)
2. Select integrations (databases, auth, AI services, etc.)
3. Configure additional options

### CLI Flags

```bash
deploy-bbc my-backend [options]
```

#### General Options

- `--no-git` - Skip Git initialization
- `--no-install` - Skip dependency installation
- `--default` - Use default configuration (Hono with no extras)
- `--CI` - Run in CI mode (non-interactive)

#### Database Options

- `--postgres` - Add PostgreSQL with Drizzle ORM
- `--mysql` - Add MySQL with Drizzle ORM
- `--mongodb` - Add MongoDB with Mongoose
- `--redis` - Add Redis support

#### Authentication Options

- `--jwt` - Add JWT authentication
- `--oauth` - Add OAuth 2.0 support
- `--session` - Add session-based authentication

#### AI Integration Options

- `--openai` - Add OpenAI integration
- `--anthropic` - Add Anthropic Claude integration
- `--gemini` - Add Google Gemini integration
- `--vercel-ai` - Add Vercel AI SDK

#### Cloud Provider Options

- `--aws` - Add AWS SDK (S3, SES)
- `--gcp` - Add Google Cloud Platform SDK
- `--azure` - Add Azure SDK
- `--cloudflare-r2` - Add Cloudflare R2 storage

#### Communication Options

- `--resend` - Add Resend email service
- `--sendgrid` - Add SendGrid email service
- `--nodemailer` - Add Nodemailer
- `--socketio` - Add Socket.IO for WebSockets
- `--sse` - Add Server-Sent Events

#### Infrastructure Options

- `--bullmq` - Add BullMQ job queue
- `--inngest` - Add Inngest workflow engine
- `--upstash-ratelimit` - Add Upstash rate limiting
- `--custom-ratelimit` - Add custom rate limiting
- `--sentry` - Add Sentry error tracking
- `--logtail` - Add Logtail logging

#### Developer Experience Options

- `--swagger` - Add Swagger/OpenAPI documentation
- `--scalar` - Add Scalar API documentation
- `--vitest` - Add Vitest testing framework
- `--zod` - Add Zod validation
- `--yup` - Add Yup validation

### Example Commands

```bash
# Create a Hono app with PostgreSQL and JWT auth
deploy-bbc my-api --postgres --jwt

# Create an Express app with full stack
deploy-bbc my-app --postgres --redis --jwt --openai --aws --swagger

# Create a minimal Bun native app
deploy-bbc my-api --default

# Create without Git initialization
deploy-bbc my-api --no-git --postgres --jwt
```

## Framework Options

### Hono (Default)

Ultra-fast web framework optimized for Bun and edge runtimes. Lightweight and type-safe.

### Express

Battle-tested Node.js framework with extensive ecosystem and middleware support.

### Bun Native HTTP

Use Bun's native HTTP server for maximum performance with minimal overhead.

## Available Integrations

### Databases

- **PostgreSQL** - Relational database with Drizzle ORM
- **MySQL** - Relational database with Drizzle ORM
- **MongoDB** - Document database with Mongoose ODM
- **Redis** - In-memory data store for caching and sessions

### Authentication

- **JWT** - JSON Web Token authentication with utilities
- **OAuth 2.0** - Third-party authentication (Google, GitHub, etc.)
- **Session** - Traditional session-based authentication

### AI & Machine Learning

- **OpenAI** - GPT models integration
- **Anthropic** - Claude AI integration
- **Google Gemini** - Gemini AI models
- **Vercel AI SDK** - Multi-provider AI SDK with streaming support

### Cloud & Storage

- **AWS** - S3 storage, SES email, and more
- **Google Cloud Platform** - Cloud Storage and services
- **Azure** - Blob storage and Azure services
- **Cloudflare R2** - S3-compatible object storage

### Communication

- **Resend** - Modern transactional email
- **SendGrid** - Email delivery service
- **Nodemailer** - Flexible email sending
- **Socket.IO** - Real-time bidirectional communication
- **Server-Sent Events** - Server-to-client streaming

### Infrastructure

- **BullMQ** - Redis-based job queue
- **Inngest** - Durable workflow engine
- **Rate Limiting** - Upstash or custom implementation
- **Sentry** - Error tracking and monitoring
- **Logtail** - Log management and analytics

### Developer Experience

- **Swagger/OpenAPI** - Interactive API documentation
- **Scalar** - Beautiful API documentation
- **Vitest** - Fast unit testing framework
- **Zod** - TypeScript-first schema validation
- **Yup** - Object schema validation

## Project Structure

```plaintext
my-backend/
├── src/
│   ├── config/          # Configuration files
│   ├── middleware/      # Express/Hono middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── db/              # Database configuration
│   ├── utils/           # Utility functions
│   ├── types/           # TypeScript types
│   └── index.ts         # Application entry point
├── .env.example         # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose setup
└── README.md
```

## Development

### Prerequisites

- Node.js >= 18.0.0
- Bun >= 1.0.0 (recommended)

### Commands

```bash
# Development mode with hot reload
bun run dev

# Build the project
bun run build

# Type checking
bun run type-check

# Lint code
bun run lint

# Format code
bun run format
```

### Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the coding conventions in `CLAUDE.md`
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

#### Coding Conventions

This project follows specific naming conventions:

- **Files/Folders**: `kebab-case`
- **Functions**: `snake_case`
- **Variables**: `snake_case`
- **Types**: `PascalCase` (use `type`, not `interface`)
- **Constants**: `SCREAMING_SNAKE_CASE`

See `CLAUDE.md` for complete guidelines.

## Docker Support

Every generated project includes Docker configuration:

```bash
# Build and run with Docker Compose
docker-compose up

# Build Docker image
docker build -t my-backend .

# Run container
docker run -p 8000:8000 my-backend
```

## Environment Variables

Each integration adds its required environment variables to `.env.example`. Copy it to `.env` and fill in your values:

```bash
cp .env.example .env
```

## License

MIT License - see LICENSE file for details

## Author

### Aritra Sarkar

- GitHub: [@aritra69](https://github.com/aritra69)
- Email: <aritrasarkar2002@gmail.com>

## Contributors

This project exists thanks to all the people who contribute.

[![Contributors](https://contrib.rocks/image?repo=aritra69/deploy-bbc)](https://github.com/aritra69/deploy-bbc/graphs/contributors)

### How to Contribute

We appreciate all contributions! See the [Contributing](#contributing) section above for guidelines.

## Support

- Issues: [GitHub Issues](https://github.com/aritra69/deploy-bbc/issues)
- Discussions: [GitHub Discussions](https://github.com/aritra69/deploy-bbc/discussions)

## Acknowledgments

Built with:

- [Bun](https://bun.sh) - Fast all-in-one JavaScript runtime
- [Hono](https://hono.dev) - Ultra-fast web framework
- [Drizzle ORM](https://orm.drizzle.team) - TypeScript ORM
- [Clack](https://github.com/natemoo-re/clack) - Interactive CLI prompts

---

**Star this repository if you find it helpful!**
