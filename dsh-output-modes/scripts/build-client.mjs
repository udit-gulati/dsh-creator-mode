/**
 * Build the browser half into the lazy-CJS factory format the DSH client
 * module system expects:
 *
 *   window.__ModuleLoader__.load({ id, factory: (require) => exports })
 *
 * React and React DOM stay external because they are platform module-table
 * rows. Everything else is inlined. The output is intentionally committed so
 * a `link:` install works without running a build.
 */

import { build } from 'esbuild'
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const entry = resolve(root, 'src/client/index.jsx')
const packageJson = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'))

const result = await build({
  entryPoints: [entry],
  bundle: true,
  write: false,
  format: 'cjs',
  platform: 'browser',
  target: 'es2022',
  jsx: 'automatic',
  external: ['react', 'react/jsx-runtime', 'react-dom'],
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  legalComments: 'none',
  logLevel: 'warning',
})

const code = result.outputFiles[0].text
const wrapped = `window.__ModuleLoader__.load({
  id: ${JSON.stringify(packageJson.name)},
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
${code}
    return module.exports;
  },
});
`
await writeFile(resolve(root, 'client.js'), wrapped, 'utf8')
console.error(`built client.js (${Buffer.byteLength(wrapped)} bytes)`)
