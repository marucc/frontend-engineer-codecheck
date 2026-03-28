import { execSync } from 'node:child_process'
import {
  copyFileSync,
  existsSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { join } from 'node:path'

import { defineConfig } from 'vite'
import type { Plugin } from 'vite'

function deployPackagePlugin(): Plugin {
  const pkgPath = join(__dirname, 'package.json')
  const distDir = join(__dirname, 'dist')
  const rootDir = join(__dirname, '..')
  const isCI = !!process.env.CI

  return {
    name: 'deploy-package',

    buildStart() {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))

      if (isCI) {
        // CI: Remove devDependencies before deploy for clean lockfile
        const original = readFileSync(pkgPath, 'utf-8')
        delete pkg.devDependencies
        writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')

        rmSync(distDir, { recursive: true, force: true })
        try {
          execSync(`pnpm --filter ${pkg.name} --prod deploy ${distDir}`, {
            cwd: rootDir,
            stdio: 'inherit',
          })
        } finally {
          writeFileSync(pkgPath, original)
        }
      } else {
        // Local/Docker: deploy as-is (lockfile doesn't need to be clean)
        rmSync(distDir, { recursive: true, force: true })
        execSync(`pnpm --filter ${pkg.name} --prod deploy ${distDir}`, {
          cwd: rootDir,
          stdio: 'inherit',
        })
      }
    },

    closeBundle() {
      // Build deploy package.json with only required fields
      const deployPkgPath = join(distDir, 'package.json')
      const src = JSON.parse(readFileSync(deployPkgPath, 'utf-8'))
      const deps: Record<string, string> = {}
      for (const [key, value] of Object.entries(
        src.dependencies as Record<string, string>
      )) {
        deps[key] = value.replace(/\(.+\)$/, '')
      }
      const deployPkg = {
        name: src.name,
        engines: src.engines,
        main: 'index.js',
        dependencies: deps,
        private: true,
      }
      writeFileSync(deployPkgPath, JSON.stringify(deployPkg, null, 2) + '\n')

      // Copy .secret.local for emulator
      const secretSrc = join(__dirname, '.secret.local')
      if (existsSync(secretSrc)) {
        copyFileSync(secretSrc, join(distDir, '.secret.local'))
      }

      console.log('Deploy artifacts generated in dist/')
    },
  }
}

export default defineConfig({
  envPrefix: 'ENV_',
  plugins: [deployPackagePlugin()],
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
