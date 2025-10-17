## Project Structure

Monorepo with pnpm workspaces + TypeScript. Node.js >= 18 required.

**Apps** (`apps/`)
- `react` - Vite + React 19 + Tailwind v4
- `electron` - Desktop app (uses React as renderer)
- `api` - Hono API server with Node.js

**Packages** (`packages/`)
- `ui` - shadcn/ui components + Radix UI
- `bridge` - Electron IPC types
- `types` - Shared TypeScript types
- `utils` - Common utilities
- `config` - Shared build configs

## Quick Start

```bash
# First time setup
pnpm run setup

# Development
pnpm dev:react              # Web app at http://localhost:5173
pnpm dev:electron           # Desktop app (auto-starts React)
pnpm dev:api                # API server

# Build
pnpm build:react            # Build web app
pnpm build:unpack           # Build desktop app (unpacked, for testing)
pnpm build:mac              # macOS installer
pnpm build:win              # Windows installer
pnpm build:linux            # Linux installer
```

## Working with Workspaces

```bash
# Run command in specific package
pnpm --filter <name> <command>

# Examples
pnpm --filter react dev
pnpm --filter utils build

# Add dependencies
pnpm add <pkg> --filter <workspace>         # Production dependency
pnpm add -D <pkg> --filter <workspace>      # Dev dependency
```

## Shared Dependencies

Versions managed in `pnpm-workspace.yaml` catalog. To update a cataloged dependency:

```yaml
# In pnpm-workspace.yaml
catalog:
  'react': ^19.2.0           # Change version here
```

Then in package.json use: `"react": "catalog:"`

## Key Workflows

**Add UI Component**
```bash
cd packages/ui
pnpm adc <component-name>
```

**Build Electron App**
- `pnpm build:react` builds React app to `apps/react/dist`
- `scripts/copyRenderer.js` copies to `apps/electron/out/renderer`
- `electron-builder` packages the final app

**Linting & Type Checking**
```bash
pnpm lint                   # ESLint all packages
pnpm typecheck              # TypeScript check all packages
```

## Git Commit Standards

Pre-commit hook runs `pnpm lint` automatically. Commits must follow conventional commits:

```
feat: add new feature
fix: resolve bug
chore: update dependencies
docs: update documentation
```

Enforced types: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`

## Common Issues

**Electron build fails**
- Ensure React app is built first: `pnpm build:react`
- Check renderer files copied: `ls apps/electron/out/renderer`

**Type errors in workspace packages**
- Run `pnpm build:packages` to build shared packages
- For utils/bridge, rebuild with `pnpm --filter <pkg> build`

**Clean install**
```bash
pnpm clean:all              # Remove node_modules + build artifacts
pnpm run setup              # Fresh install
```

## Technical Stack

- **React**: v19 with React Compiler
- **Tailwind**: v4 with PostCSS
- **Build**: Vite (web), electron-vite (desktop)
- **Lint**: @antfu/eslint-config
- **Package Manager**: pnpm v10.12.4 (enforced)
- **Electron**: v38 with electron-builder

## Others (important!)

- 注释规范: 仅写有必要写的注释, 不要写无意义的注释, 请使用中文写注释
- 代码规范: 不要重复造轮子, 不要造劣质轮子, 对于 React hooks 推荐使用 ahooks, 对于 通用 utils 推荐使用 lodash-es. 如果无法使用三方库满足需求, 请在 packages/utils 中实现
