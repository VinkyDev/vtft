# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VTFT is a multi-platform application (React Web, Electron Desktop) with an API server backend. The project crawls and manages game data using Axios-based scrapers and MongoDB for storage.

## Architecture

**Monorepo Structure** (pnpm workspaces):
- `apps/`: Application entry points
  - `react/`: Web application (Vite + React 19 + TailwindCSS)
  - `electron/`: Desktop application (Electron 39 + electron-vite)
  - `server/`: API server (Hono + Node.js)
  - `website/`: Marketing/documentation website (Next.js 16 + Static Export)
- `packages/`: Shared libraries
  - `api-client/`: HTTP client for API communication (Axios-based)
  - `bridge/`: Electron IPC communication layer (clipboard, shortcuts, overlay, window)
  - `crawler/`: Axios-based web scraping (champions, items, comps, augments)
  - `db/`: MongoDB database layer
  - `logger/`: Logging utilities
  - `react-helper/`: React utilities
  - `types/`: Shared TypeScript types
  - `ui/`: UI components
  - `utils/`: General utilities

**Build Dependencies** (must be built in order):
1. `types`
2. `utils`
3. `logger`, `bridge` (parallel)
4. `db`, `react-helper`, `api-client` (parallel)
5. `crawler`

Packages are built with `rslib` (db, crawler, bridge, react-helper, api-client, server). The `ui` and `config` packages skip build steps.

## Common Commands

### Setup
```bash
pnpm run setup              # Clean, install deps, build packages
```

### Development
```bash
pnpm dev:react              # React web app (Vite dev server)
pnpm dev:electron           # Electron desktop app (electron-vite dev server)
pnpm dev:desktop            # Desktop app (electron-vite + React dev server)
pnpm dev:server             # API server (tsx watch)
pnpm dev:website            # Website (Next.js dev server)
```

### Building
```bash
pnpm build:packages         # Build all workspace packages in correct order
pnpm build:react            # Build React web app
pnpm build:electron         # Build Electron app
pnpm build:server           # Build API server (rslib)
pnpm build:website          # Build website (Next.js static export)

# Desktop builds (runs prebuild automatically)
pnpm build:unpack           # Unpacked desktop app
pnpm build:win              # Windows installer
pnpm build:mac              # macOS installer
pnpm build:linux            # Linux installer
```

### Quality Checks
```bash
pnpm lint                   # Lint all packages
pnpm typecheck              # Type check all packages
pnpm check                  # Run lint + typecheck in parallel
```

### Crawler Scripts
```bash
# Run standalone crawlers (packages/crawler)
pnpm --filter crawler crawl:comps
pnpm --filter crawler crawl:items
pnpm --filter crawler crawl:champions
pnpm --filter crawler crawl:augments
```

### Cleaning
```bash
pnpm clean:dist             # Remove all dist/build outputs
pnpm clean:modules          # Remove node_modules
pnpm clean:all              # Clean everything
```

## Key Technical Details

### Package Manager
- **pnpm 10.12.4** is required (enforced by `packageManager` field)
- Only pnpm allowed (`preinstall` hook blocks npm/yarn)
- Workspace packages use `catalog:` protocol for shared dependencies
- Only build `electron` and `esbuild` dependencies (`onlyBuiltDependencies`)

### Server (apps/server)
- Built with Hono framework for API routes
- Uses `node-cron` task scheduler for periodic crawler jobs
- Connects to MongoDB via `db` package
- Middleware stack: timing, logger, cors, compress, etag, error handler
- Swagger UI at `/docs`, OpenAPI spec at `/openapi.json`
- Health check endpoint at `/health`
- Graceful shutdown on SIGINT/SIGTERM

### Electron (apps/electron)
- Main process: `apps/electron/src/main/index.ts`
- Preload scripts: `apps/electron/src/preload/`
- IPC bridge defined in `packages/bridge/src/electron/`
- System tray support
- Global shortcuts, overlay windows, clipboard access

### React (apps/react)
- React 19 with Vite 7 and TailwindCSS 4
- Babel React Compiler enabled
- State management: Zustand
- Uses `api-client` package for API communication
- Routes defined in `src/routes.tsx`

### Website (apps/website)
- Next.js 16 with static export mode (`output: "export"`)
- React 19 with TailwindCSS 4
- Animation library: Framer Motion
- Static site output to `out/` directory
- Uses shared `ui` and `react-helper` packages

### API Client (packages/api-client)
- Axios-based HTTP client for API communication
- Built with rslib for package distribution
- Provides typed endpoints for backend API
- Used by React app and other client applications
- Depends on `types` and `utils` packages

### Database
- MongoDB via `mongodb` package
- Database service in `packages/db/`
- Used by server and crawler packages

### Crawler
- Axios-based HTTP scraping
- CLI scripts in `packages/crawler/src/cli/`
- Can run standalone or via scheduled tasks in server

## Deployment

### Server Deployment
- Automatic Docker build/push on main branch via GitHub Actions (`.github/workflows/docker-publish.yml`)
- Docker image: `${DOCKER_USERNAME}/vtft-server`
- Base image: `node:22-bookworm-slim`
- Build process:
  1. Build packages: `pnpm run build:packages`
  2. Build server: `pnpm run build:server`
  3. Prepare server package: `node scripts/prepareServerPackage.mjs prepare`
  4. Docker build from `apps/server/Dockerfile`
- Server runs as `node dist/index.js` on port 3000

### Desktop Deployment
- GitHub Actions can be added for desktop app releases
- Current manual build via `pnpm build:win|mac|linux`

## Development Notes

### TypeScript Configuration
- Project uses TypeScript 5.9.3
- Path aliases configured for workspace packages
- Run `pnpm fix:tsconfig` to fix TypeScript paths if needed

### Linting
- ESLint 9 with `@antfu/eslint-config`
- React plugins: `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
- Format plugin: `eslint-plugin-format`
- Ignores: `node_modules`, `dist`, `build`, `out`, `.vite`

### Commit Conventions
- Uses Commitlint with conventional commits
- Husky git hooks configured
- lint-staged runs ESLint on staged files

### Knip Configuration
- Dependency/export analysis configured in `.knip.json`
- Run `pnpm knip` to check for unused dependencies

## Environment Variables
- Server uses `.env` file in root (loaded via dotenv)
- Required vars for server: `PORT` (default: 3000), MongoDB connection string

## Code Standards

### Comments
- Use Chinese comments (中文注释) to explain key logic and complex algorithms
- Only add comments where necessary - code should be self-documenting when possible
- Focus comments on "why" rather than "what"

### Libraries and Dependencies
- **Don't reinvent the wheel** - prefer established libraries:
  - React hooks: Use `ahooks` for common hook patterns
  - Utilities: Use `lodash-es` for general utilities
- If third-party libraries cannot meet requirements, check `packages/utils` first before implementing
- Add new utilities to `packages/utils` for project-wide reuse

### Code Organization
- **High cohesion, low coupling**: Split components and logic reasonably
- **Single Responsibility Principle**: Each module/function should have one clear purpose
- Keep components focused and composable
- Extract shared logic into hooks or utilities

### TypeScript
- **Never use `any`** - use generics to improve code reusability and type safety
- When `any` is unavoidable, use `unknown` instead and narrow the type
- Leverage TypeScript's type system fully for better IDE support and fewer runtime errors
- Define clear interfaces and types for data structures

### Modern JavaScript/TypeScript Patterns
- Use optional chaining `?.` to safely access nested properties
- Use nullish coalescing `??` instead of `||` when appropriate
- Prefer `async/await` over raw Promises for asynchronous operations
- Use template literals for string interpolation

### Error Handling
- Flatten error handling - avoid excessive nested `try-catch` blocks
- Use centralized, converged error handling patterns
- Let errors bubble up to appropriate boundaries (API middleware, error boundaries)
- For expected errors, use explicit error types/codes rather than throwing

### Design Principles
- Follow **DRY (Don't Repeat Yourself)** - extract repeated logic
- Avoid over-engineering - balance abstraction with practicality
- Prioritize **readability** and **maintainability** over cleverness
- Keep code simple and obvious when possible
