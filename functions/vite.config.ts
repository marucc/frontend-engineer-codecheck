import { execSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

function computeDeployHash(pkgPath: string, rootDir: string): string {
  const pkgContent = readFileSync(pkgPath, 'utf-8')
  const lockContent = readFileSync(join(rootDir, 'pnpm-lock.yaml'), 'utf-8')
  return createHash('sha256')
    .update(pkgContent)
    .update(lockContent)
    .digest('hex')
    .slice(0, 16)
}

function needsDeploy(distDir: string, currentHash: string): boolean {
  if (!existsSync(join(distDir, 'node_modules'))) return true
  const distPkgPath = join(distDir, 'package.json')
  if (!existsSync(distPkgPath)) return true
  const distPkg = JSON.parse(readFileSync(distPkgPath, 'utf-8'))
  return distPkg._deployHash !== currentHash
}

function deployPackagePlugin(): Plugin {
  const pkgPath = join(__dirname, 'package.json')
  const distDir = join(__dirname, 'dist')
  const rootDir = join(__dirname, '..')

  return {
    name: 'deploy-package',

    buildStart() {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
      const hash = computeDeployHash(pkgPath, rootDir)

      // Watch: skip if dist is up to date
      if (this.meta.watchMode && !needsDeploy(distDir, hash)) return

      // Deploy production dependencies from lockfile
      rmSync(distDir, { recursive: true, force: true })
      execSync(`pnpm --filter ${pkg.name} --prod deploy ${distDir}`, {
        cwd: rootDir,
        stdio: 'inherit',
      })

      // Clean dist/package.json for Firebase Cloud Build
      const deployPkgPath = join(distDir, 'package.json')
      const src = JSON.parse(readFileSync(deployPkgPath, 'utf-8'))
      const deps: Record<string, string> = {}
      for (const [key, value] of Object.entries(
        src.dependencies as Record<string, string>
      )) {
        deps[key] = value.replace(/\(.+\)$/, '')
      }
      writeFileSync(
        deployPkgPath,
        JSON.stringify(
          {
            name: src.name,
            engines: src.engines,
            main: 'index.js',
            dependencies: deps,
            private: true,
            _deployHash: hash,
          },
          null,
          2
        ) + '\n'
      )

      // Regenerate lockfile to match cleaned package.json
      writeFileSync(
        join(distDir, 'pnpm-workspace.yaml'),
        'injectWorkspacePackages: true\n'
      )
      execSync(
        'pnpm install --lockfile-only --no-frozen-lockfile --ignore-workspace',
        { cwd: distDir, stdio: 'inherit' }
      )
    },
  }
}

export default defineConfig({
  envPrefix: 'ENV_',
  plugins: [
    deployPackagePlugin(),
    viteStaticCopy({
      targets: [{ src: '.secret.local', dest: '.' }],
      silent: true,
      environment: 'ssr',
    }),
  ],
  build: {
    ssr: 'src/index.ts',
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      external: ['firebase-admin', 'firebase-functions'],
      output: {
        format: 'cjs',
        entryFileNames: 'index.js',
      },
    },
  },
})
