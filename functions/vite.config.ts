import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    ssr: 'src/index.ts',
    outDir: 'dist',
    rollupOptions: {
      external: ['firebase-admin', 'firebase-functions'],
      output: {
        format: 'cjs',
        entryFileNames: 'index.js',
      },
    },
  },
})
