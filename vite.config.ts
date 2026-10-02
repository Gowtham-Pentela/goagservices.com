import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const rawNoIndex = env.VITE_NOINDEX ?? process.env.VITE_NOINDEX ?? 'true'
  const isNoIndex = rawNoIndex === 'true' || rawNoIndex === '1' || rawNoIndex === 'noindex' || rawNoIndex === 'noindex, nofollow'
  const robotsContent = isNoIndex ? 'noindex, nofollow' : 'index, follow'

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'html-robots-transform',
        transformIndexHtml(html) {
          return html.replace(
            /<meta name="robots" content=".*?" \/>/,
            `<meta name="robots" content="${robotsContent}" />`
          )
        },
      },
    ],
    base: process.env.BASE_PATH || '/',
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
            'motion-vendor': ['motion/react'],
            'lucide-vendor': ['lucide-react'],
          },
        },
      },
    },
  }
})
