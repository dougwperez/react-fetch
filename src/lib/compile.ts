import { transform } from 'sucrase'
import * as React from 'react'
import * as JsxRuntime from 'react/jsx-runtime'

export type CompileResult =
  | { ok: true; Component: React.ComponentType; js: string }
  | { ok: false; error: string; js: string }

// The only modules a challenge is allowed to import at runtime.
const MODULES: Record<string, unknown> = {
  react: React,
  'react/jsx-runtime': JsxRuntime,
  'react/jsx-dev-runtime': JsxRuntime,
}

// `import type { User } from '../types'` is erased by the TS transform, but a
// plain `import { User }` isn't — hand back an empty object so it still runs.
const isTypesModule = (name: string) => /(^|\/)types$/.test(name)

function describe(err: unknown): string {
  if (err instanceof Error) return err.message
  return String(err)
}

export function compile(source: string): CompileResult {
  let js = ''

  try {
    js = transform(source, {
      transforms: ['jsx', 'typescript', 'imports'],
      jsxRuntime: 'automatic',
      production: true,
    }).code
  } catch (err) {
    return { ok: false, error: `Syntax error — ${describe(err)}`, js: '' }
  }

  try {
    const module = { exports: {} as Record<string, unknown> }

    const require = (name: string): unknown => {
      if (name in MODULES) return MODULES[name]
      if (isTypesModule(name)) return {}
      throw new Error(`Cannot import "${name}" here — only 'react' is available.`)
    }

    // eslint-disable-next-line no-new-func
    const run = new Function('require', 'module', 'exports', js)
    run(require, module, module.exports)

    const Component = module.exports.default

    if (typeof Component !== 'function') {
      return {
        ok: false,
        error: 'No component found — your file needs `export default function ...`.',
        js,
      }
    }

    return { ok: true, Component: Component as React.ComponentType, js }
  } catch (err) {
    return { ok: false, error: describe(err), js }
  }
}
