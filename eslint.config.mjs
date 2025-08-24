// eslint.config.mjs
// INGFO: ESLint v9 Flat Config for Next.js + TypeScript + Prettier. 🚦
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import nextPlugin from '@next/eslint-plugin-next';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// INGFO: Compat agar bisa pakai shareable config lama seperti 'next/core-web-vitals' & 'prettier'. 🔄
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [{
  ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"]
}, // INGFO: Gantikan .eslintignore → taruh di sini. 🧹
{
  ignores: [
    'node_modules/**',
    '.next/**',
    'out/**',
    'dist/**',
    'build/**',
    'coverage/**',
    '.vscode/**',
    'next-env.d.ts',
  ],
}, // INGFO: Ambil rekomendasi Next + TypeScript + Prettier (disable styling rules). 📦
...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'), // INGFO: Tambahan plugin & rules kita (import order + unused imports). 🧩
{
  plugins: {
    '@next/next': nextPlugin,
    import: importPlugin,
    'unused-imports': unusedImports,
  },
  rules: {
    'unused-imports/no-unused-imports': 'error',
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
      },
    ],
  },
}];
