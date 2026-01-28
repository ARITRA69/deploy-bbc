# deploy-bbc

Image.png

<p align="center">
  <img src="https://img.shields.io/npm/v/deploy-bbc" alt="npm version" />
  <img src="https://img.shields.io/npm/dt/deploy-bbc" alt="npm downloads" />
  <img src="https://img.shields.io/github/stars/aritra69/deploy-bbc" alt="github stars" />
  <img src="https://img.shields.io/github/license/aritra69/deploy-bbc" alt="license" />
</p>

---

## Overview

`deploy-bbc` is an interactive command-line tool that scaffolds modern, type-safe backend applications using Bun.

It ships with production-ready defaults, optional integrations, Docker support, and a clean architecture so you can focus on building features instead of wiring infrastructure.

---

## Tech Stack

<p align="center">
  <img height="40" src="https://bun.sh/logo.svg" alt="Bun" />
  <img height="40" src="https://hono.dev/images/logo.svg" alt="Hono" />
  <img height="40" src="https://raw.githubusercontent.com/expressjs/expressjs.com/gh-pages/images/favicon.png" alt="Express" />
  <img height="40" src="https://www.typescriptlang.org/icons/icon-48x48.png" alt="TypeScript" />
  <img height="40" src="https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png" alt="Docker" />
</p>

---

## Features

- ⚡ **Three framework options**: Hono, Express, or Bun Native HTTP
- 🚀 **Production-ready templates** with best practices
- 🔌 **30+ integrations** (databases, auth, AI, cloud, infra)
- 🛡️ **Fully type-safe** with strict TypeScript
- 🐳 **Dockerfile and docker-compose** included
- 💎 **Strong developer experience** with testing and docs
- ⚙️ **Zero-config defaults** that work out of the box

---

## Quick Start

```bash
npx deploy-bbc my-backend
# or
bunx deploy-bbc my-backend
```

---

## Framework Options

<p align="center">
  <img height="36" src="https://hono.dev/images/logo.svg" alt="Hono" />
  <img height="36" src="https://raw.githubusercontent.com/expressjs/expressjs.com/gh-pages/images/favicon.png" alt="Express" />
  <img height="36" src="https://bun.sh/logo.svg" alt="Bun" />
</p>

- **Hono** (default) – lightweight and edge-ready
- **Express** – battle-tested Node.js framework
- **Bun Native HTTP** – minimal overhead, maximum performance

---

## Databases and Caching

<p align="center">
  <img height="40" src="https://www.postgresql.org/media/img/about/press/elephant.png" alt="PostgreSQL" />
  <img height="40" src="https://www.mysql.com/common/logos/logo-mysql-170x115.png" alt="MySQL" />
  <img height="40" src="https://www.mongodb.com/assets/images/global/favicon.ico" alt="MongoDB" />
  <img height="40" src="https://cdn.brandfetch.io/idwlYcQpHB/theme/dark/symbol.svg?c=1bxid64Mup7aczewSAYMX&t=1668515608635" alt="Redis" />
</p>

- **PostgreSQL** with Drizzle ORM
- **MySQL** with Drizzle ORM
- **MongoDB** with Mongoose
- **Redis** for caching and queues

---

## Authentication

<p align="center">
  <img height="36" src="https://jwt.io/img/pic_logo.svg" alt="JWT" />
  <img height="36" src="https://oauth.net/images/oauth-logo-square.png" alt="OAuth" />
</p>

- JWT authentication
- OAuth 2.0 providers
- Session-based authentication

---

## AI Integrations

<p align="center">
  <img height="40" src="https://openai.com/favicon.ico" alt="OpenAI" />
  <img height="40" src="https://www.anthropic.com/favicon.ico" alt="Anthropic" />
  <img height="40" src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" alt="Gemini" />
  <img height="40" src="https://vercel.com/favicon.ico" alt="Vercel" />
</p>

- OpenAI
- Anthropic Claude
- Google Gemini
- Vercel AI SDK

---

## Cloud and Storage

<p align="center">
  <img height="36" src="https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png" alt="AWS" />
  <img height="36" src="https://cloud.google.com/_static/cloud/images/social-icon-google-cloud-1200-630.png" alt="GCP" />
  <img height="36" src="https://azure.microsoft.com/svghandler/azure-logo.svg" alt="Azure" />
  <img height="36" src="https://cdn.brandfetch.io/idJ3Cg8ymG/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1668515610854" alt="Cloudflare" />
</p>

- **AWS** (S3, SES)
- **Google Cloud Platform**
- **Azure**
- **Cloudflare R2**

---

## Communication and Realtime

<p align="center">
  <img height="36" src="https://cdn.brandfetch.io/id0BqaqET6/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1748366671512" alt="Resend" />
  <img height="36" src="https://sendgrid.com/favicon.ico" alt="SendGrid" />
  <img height="36" src="https://socket.io/images/logo.svg" alt="Socket.IO" />
</p>

- Resend
- SendGrid
- Nodemailer
- Socket.IO
- Server-Sent Events (SSE)

---

## Developer Experience

<p align="center">
  <img height="36" src="https://vitest.dev/logo.svg" alt="Vitest" />
  <img height="36" src="https://zod.dev/_next/image?url=%2Flogo%2Flogo-glow.png&w=640&q=100" alt="Zod" />
  <img height="36" src="https://static1.smartbear.co/swagger/media/assets/images/swagger_logo.svg" alt="Swagger" />
</p>

- Vitest
- Zod and Yup
- Swagger / OpenAPI
- Scalar documentation

---

## Project Structure

```
src/
├── config/
├── middleware/
├── routes/
├── services/
├── db/
├── utils/
├── types/
└── index.ts
```

---

## Docker Support

```bash
docker-compose up
```

Dockerfile and docker-compose are included by default.

---

## Contributors

<a href="https://github.com/aritra69/deploy-bbc/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=aritra69/deploy-bbc" alt="Contributors" />
</a>

A big thank you to all the contributors who have helped make this project better! 🙏

---

## Author

**Aritra Sarkar**

- GitHub: [https://github.com/aritra69](https://github.com/aritra69)
- Email: <aritrasarkar2002@gmail.com>

---

## License

MIT License

---

## Support

If this project helps you, consider ⭐ starring the repository.

Issues, pull requests, and discussions are welcome!
