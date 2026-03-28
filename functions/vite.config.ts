import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { defineConfig } from 'vite'
import type { Plugin } from 'vite'

function deployPackagePlugin(): Plugin {
  return {
    name: 'deploy-package',
    closeBundle() {
      const distDir = join(__dirname, 'dist')

      // Build deploy package.json with only required fields
      const pkgPath = join(distDir, 'package.json')
      const src = JSON.parse(readFileSync(pkgPath, 'utf-8'))
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
      writeFileSync(pkgPath, JSON.stringify(deployPkg, null, 2) + '\n')

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
