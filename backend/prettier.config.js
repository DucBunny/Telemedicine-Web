//  @ts-check

/** @type {import('prettier').Config} */
const config = {
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  printWidth: 80,
  bracketSameLine: true,
  htmlWhitespaceSensitivity: 'ignore',

  // -- Sort imports --
  importOrder: ['<THIRD_PARTY_MODULES>', '^@/(.*)$', '^[./]'],
  importOrderCaseSensitive: true,
}

export default config
