# Project Conventions & Guidelines

This document outlines the coding conventions and guidelines for the `create-backend-app` project.

---

## 📁 File & Folder Naming Conventions

### ✅ Use `kebab-case` for ALL files and folders

**Files:**

```
✅ create-project.ts
✅ install-dependencies.ts
✅ generate-docker-compose.ts
✅ scaffold-project.ts

❌ createProject.ts
❌ installDependencies.ts
❌ generate_docker_compose.ts
```

**Folders:**

```
✅ src/helpers/
✅ src/templates/extras/
✅ src/utils/dependency-versions/
✅ templates/extras/ai/vercel-ai/

❌ src/Helpers/
❌ src/templates_extras/
❌ src/utils/dependencyVersions/
```

**Why kebab-case?**

- URL-friendly
- Case-insensitive filesystem compatible
- Easy to read
- Industry standard for file systems

---

## 🔧 Function Naming Conventions

### ✅ Use `snake_case` for ALL function definitions

**Functions:**

```typescript
✅ export async function create_project(options: CliResults) { }
✅ export function install_dependencies(projectDir: string) { }
✅ export function generate_dockerfile(options: ProjectOptions) { }
✅ function add_package_dependency(pkg: string) { }

❌ export async function createProject(options: CliResults) { }
❌ export function installDependencies(projectDir: string) { }
❌ export function generateDockerfile(options: ProjectOptions) { }
```

**Why snake_case?**

- Consistent with Python/Rust conventions
- Clear word separation
- Easy to read in longer function names
- Reduces cognitive load when switching between languages

---

## 📝 Variable Naming Conventions

### Use `camelCase` for variables and parameters

```typescript
✅ const projectDir = "/path/to/project";
✅ const selectedPackages = ["postgres", "redis"];
✅ let isInstalling = false;

❌ const project_dir = "/path/to/project";
❌ const selected_packages = ["postgres", "redis"];
```

**Why camelCase for variables?**

- TypeScript/JavaScript standard
- Matches ecosystem conventions
- Better IDE support

---

## 🎯 Constants

### Use `SCREAMING_SNAKE_CASE` for constants

```typescript
✅ const DEFAULT_PORT = 3000;
✅ const MAX_RETRIES = 3;
✅ const DATABASE_URL = process.env.DATABASE_URL;

❌ const defaultPort = 3000;
❌ const maxRetries = 3;
```

---

## 📦 Type & Interface Naming

### Use `PascalCase` for types, interfaces, enums, and classes

```typescript
✅ interface CliResults { }
✅ type InstallerOptions = { }
✅ enum AvailablePackages { }
✅ class ProjectScaffold { }

❌ interface cli_results { }
❌ type installer_options = { }
```

---

## 🗂️ Import/Export Conventions

### Named exports preferred over default exports

```typescript
✅ export function create_project() { }
✅ export const install_dependencies = () => { }

❌ export default function createProject() { }
```

### Import organization

```typescript
// 1. External dependencies
import chalk from "chalk";
import * as p from "@clack/prompts";

// 2. Internal absolute imports
import { logger } from "../utils/logger.js";
import { type CliResults } from "../types/index.js";

// 3. Relative imports
import { create_project } from "./create-project.js";
```

---

## 📋 Complete Example

```typescript
// src/helpers/scaffold-project.ts

import path from "path";
import fs from "fs-extra";
import { type CliResults, type InstallerOptions } from "../types/index.js";
import { logger } from "../utils/logger.js";
import { install_dependencies } from "./install-dependencies.js";

const DEFAULT_PROJECT_DIR = process.cwd();
const TEMPLATE_BASE_PATH = "../templates/base";

interface ScaffoldOptions {
  projectDir: string;
  appName: string;
  packages: string[];
}

export async function scaffold_project(options: CliResults): Promise<void> {
  const projectDir = path.resolve(DEFAULT_PROJECT_DIR, options.appName);
  
  logger.info(`Creating project at: ${projectDir}`);
  
  await create_base_structure(projectDir);
  await copy_template_files(projectDir, options.packages);
  
  if (!options.flags.noInstall) {
    await install_dependencies(projectDir);
  }
  
  logger.success("✅ Project scaffolded successfully!");
}

async function create_base_structure(projectDir: string): Promise<void> {
  await fs.ensureDir(projectDir);
  await fs.ensureDir(path.join(projectDir, "src"));
  await fs.ensureDir(path.join(projectDir, "src", "routes"));
}

async function copy_template_files(
  projectDir: string, 
  packages: string[]
): Promise<void> {
  const templatePath = path.resolve(__dirname, TEMPLATE_BASE_PATH);
  await fs.copy(templatePath, projectDir);
}

function get_package_installer(packageName: string) {
  // Implementation
}
```

---

## 🎨 Template File Naming

### Template files should also use kebab-case

```
✅ templates/base/src/index.ts
✅ templates/extras/database/postgres/src/db/index.ts
✅ templates/extras/ai/vercel-ai/src/services/ai/index.ts
✅ templates/extras/queue/bullmq/src/queue/email-job.ts

❌ templates/base/src/Index.ts
❌ templates/extras/database/postgres/src/db/dbIndex.ts
❌ templates/extras/ai/vercel-ai/src/services/ai/aiService.ts
```

---

## 🔍 Linting Rules

To enforce these conventions, configure ESLint:

```json
{
  "rules": {
    "camelcase": ["error", { 
      "properties": "never",
      "allow": ["^[a-z]+(_[a-z]+)*$"]
    }],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "function",
        "format": ["snake_case"]
      },
      {
        "selector": "variable",
        "format": ["camelCase", "UPPER_CASE"]
      },
      {
        "selector": "typeLike",
        "format": ["PascalCase"]
      }
    ]
  }
}
```

---

## 🚫 Common Mistakes to Avoid

### ❌ Don't mix conventions

```typescript
❌ function createProject() { }  // camelCase function
❌ const project_dir = "";       // snake_case variable
❌ src/CreateProject.ts          // PascalCase file
```

### ✅ Do stick to the rules

```typescript
✅ function create_project() { }  // snake_case function
✅ const projectDir = "";         // camelCase variable
✅ src/create-project.ts          // kebab-case file
```

---

## 📚 Summary Table

| Element | Convention | Example |
|---------|-----------|---------|
| **Files** | `kebab-case` | `create-project.ts` |
| **Folders** | `kebab-case` | `src/helpers/` |
| **Functions** | `snake_case` | `function create_project()` |
| **Variables** | `camelCase` | `const projectDir` |
| **Constants** | `SCREAMING_SNAKE_CASE` | `const MAX_RETRIES` |
| **Types/Interfaces** | `PascalCase` | `interface CliResults` |
| **Enums** | `PascalCase` | `enum AvailablePackages` |
| **Classes** | `PascalCase` | `class ProjectScaffold` |

---

## 🤝 Contributing

When contributing to this project, please:

1. ✅ Follow ALL conventions outlined in this document
2. ✅ Run linting before committing: `bun run lint`
3. ✅ Format code: `bun run format`
4. ✅ Use descriptive commit messages
5. ✅ Add JSDoc comments for exported functions

---

## 💡 Rationale

These conventions are chosen to:

- **Maintain consistency** across the codebase
- **Improve readability** for all contributors
- **Reduce cognitive load** when working with multiple languages
- **Follow industry standards** where applicable
- **Enable better tooling support**

---

## 📖 References

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [File Naming Conventions](https://github.com/kettanaito/naming-cheatsheet)

---

**Last Updated:** January 2026  
**Maintainer:** @yourname

---

*Questions or suggestions? Open an issue or PR!*
