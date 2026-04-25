//  @ts-check

/** @type {import('prettier').Config} */
const config = {
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
  tailwindFunctions: ['cva', 'clsx', 'cn'],
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  tabWidth: 2,
  printWidth: 80,
  bracketSameLine: true,
  htmlWhitespaceSensitivity: 'ignore',

  // -- Sort imports --
  importOrder: [
    '^react',
    '<THIRD_PARTY_MODULES>',
    '',
    '<TYPES>',
    '<TYPES>^@/(.*)$',
    '<TYPES>^[./]',
    '',
    '^@/features/(.*)$',
    '^@/(.*)$',
    '^[./]',
  ],
  importOrderCaseSensitive: true,
}

export default config
