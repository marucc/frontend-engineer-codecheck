import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { defineConfig } from 'vite'
import type { Plugin } from 'vite'

function deployPackagePlugin(): Plugin {
  return {
    name: 'deploy-package',
    closeBundle() {
      const distDir = join(__dirname, 'dist')

      // Clean up package.json for Firebase Cloud Build
      const pkgPath = join(distDir, 'package.json')
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
      delete pkg.devDependencies
      delete pkg.optionalDependencies
      delete pkg.scripts
      delete pkg.files
      if (pkg.pnpm && Object.keys(pkg.pnpm).length === 0) delete pkg.pnpm
      pkg.main = 'index.js'
      // Remove pnpm peer dep suffixes from dependency versions
      for (const [key, value] of Object.entries(
        pkg.dependencies as Record<string, string>
      )) {
        pkg.dependencies[key] = value.replace(/\(.+\)$/, '')
      }
      writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')

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
