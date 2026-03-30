import { execSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

function computeDeployHash(pkgPath: string, rootDir: string): string {
  const pkgContent = readFileSync(pkgPath, 'utf-8')
  const lockContent = readFileSync(resolve(rootDir, 'pnpm-lock.yaml'), 'utf-8')
  return createHash('sha256')
    .update(pkgContent)
    .update(lockContent)
    .digest('hex')
    .slice(0, 16)
}

function needsDeploy(distDir: string, currentHash: string): boolean {
  if (!existsSync(resolve(distDir, 'node_modules'))) return true
  const distPkgPath = resolve(distDir, 'package.json')
  if (!existsSync(distPkgPath)) return true
  const distPkg = JSON.parse(readFileSync(distPkgPath, 'utf-8'))
  return distPkg._deployHash !== currentHash
}

function deployPackagePlugin(): Plugin {
  const pkgPath = resolve(__dirname, 'package.json')
  const distDir = resolve(__dirname, 'dist')
  const rootDir = resolve(__dirname, '..')

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
      const deployPkgPath = resolve(distDir, 'package.json')
      const src = JSON.parse(readFileSync(deployPkgPath, 'utf-8'))
      const deps: Record<string, string> = {}
      for (const [key, value] of Object.entries(
        src.dependencies as Record<string, string>
      )) {
        deps[key] = value.replace(/\(.+\)$/, '')
      }
      const cleanPkg: Record<string, unknown> = {
        name: src.name,
        private: true,
        ...(src.type && { type: src.type }),
        main: (src.main as string).replace(/^dist\//, ''),
        engines: src.engines,
        dependencies: deps,
        ...(src.packageManager && { packageManager: src.packageManager }),
        _deployHash: hash,
      }
      writeFileSync(deployPkgPath, JSON.stringify(cleanPkg, null, 2) + '\n')

      // Regenerate lockfile to match cleaned package.json
      writeFileSync(
        resolve(distDir, 'pnpm-workspace.yaml'),
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
