import { defineConfig, loadEnv, type Plugin } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver(): Plugin {
  return {
    name: 'figma-asset-resolver',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

/**
 * Serves POST /api/subscribe during `npm run dev`, so the waitlist form works
 * locally without `vercel dev`. In production this route is the real Vercel
 * function in api/subscribe.ts — both call the same api/_loops.ts logic.
 */
function devSubscribeApi(env: Record<string, string>): Plugin {
  return {
    name: 'dev-subscribe-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/subscribe', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Allow', 'POST')
          res.end(JSON.stringify({ ok: false, error: 'Method not allowed.' }))
          return
        }

        const chunks: Buffer[] = []
        for await (const chunk of req) chunks.push(chunk as Buffer)

        let parsed: Record<string, unknown> = {}
        try {
          parsed = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
        } catch {
          /* fall through to validation below */
        }

        // _loops.ts reads the list ids off process.env, which loadEnv does not
        // populate — without this, dev silently skips the mailing list while
        // production adds it, so the two disagree about what a signup does.
        // Guarded: assigning undefined to process.env stores the *string*
        // "undefined", which is truthy and would be sent to Loops as a list id.
        if (env.LOOPS_MAILING_LIST_ID) process.env.LOOPS_MAILING_LIST_ID ??= env.LOOPS_MAILING_LIST_ID
        if (env.LOOPS_AFFILIATE_LIST_ID) process.env.LOOPS_AFFILIATE_LIST_ID ??= env.LOOPS_AFFILIATE_LIST_ID

        // Loaded through Vite so TS is transpiled on the fly.
        const { subscribe } = await server.ssrLoadModule('/api/_loops.ts')
        const { status, body } = await subscribe(parsed, env.LOOPS_API_KEY)

        res.statusCode = status
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(body))
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  // '' prefix so unprefixed server-side vars (LOOPS_API_KEY) load too. These are
  // only handed to the dev middleware and are never inlined into the bundle.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      figmaAssetResolver(),
      devSubscribeApi(env),
      // The React and Tailwind plugins are both required for Make, even if
      // Tailwind is not being actively used – do not remove them
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        // Alias @ to the src directory
        '@': path.resolve(__dirname, './src'),
      },
    },

    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          affiliate: path.resolve(__dirname, 'affiliate/index.html'),
        },
      },
    },

    // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
    assetsInclude: ['**/*.svg', '**/*.csv'],
  }
})
