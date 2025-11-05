import { defineConfig } from "tsup";
import { resolve, join } from "node:path";
import { readFileSync } from "node:fs";

function getWorkspaceInternals(pkgPath: string) {
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  const deps = pkg.dependencies || {};
  const devDeps = pkg.devDependencies || {};

  const workspaceDeps = Object.keys({
    ...deps,
    ...devDeps,
  }).filter((name) => {
    const version = deps[name] || devDeps[name];
    return typeof version === "string" && version.startsWith("workspace:");
  });

  return workspaceDeps;
}

export default defineConfig(() => {
  const pkgPath = join(__dirname, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  const workspaceDeps = getWorkspaceInternals(pkgPath);

  return {
    entry: ["src/index.ts"],
    outDir: "dist",
    format: ["cjs"],
    target: "node18",
    clean: true,
    sourcemap: true,
    dts: false,
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDeendencies || {}),
      "playwright"
    ],

    noExternal: workspaceDeps,

    esbuildOptions(options) {
      const aliases: Record<string, string> = {};
      for (const name of workspaceDeps) {
        aliases[name] = resolve(__dirname, `../../packages/${name}/dist`);
      }
      options.alias = aliases;
    },
  };
});
