import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // The react-hooks v6 strictness rules (new in eslint-config-next 16) flag
    // standard R3F idioms (texture setup in effects, randomized geometry in
    // useMemo, the mounted hydration gate). Keep them visible as warnings.
    // Scoped to TS/TSX: plain Node scripts (scripts/*.cjs) aren't covered by
    // the Next configs that register the react-hooks plugin.
    files: ['**/*.{ts,tsx}'],
    rules: {
      'react-hooks/purity': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
  globalIgnores([
    '.next/**',
    'node_modules/**',
    'out/**',
    'next-env.d.ts',
    // Third-party compiled Draco decoders are shipped verbatim.
    'public/draco/**',
    // Standalone Node asset tooling, not app code.
    'scripts/**',
  ]),
])

export default eslintConfig
