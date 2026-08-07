/** @type {import('lint-staged').Configuration} */
export default {
  '*.{ts,tsx}': ['oxlint --fix', 'prettier --write'],
  '*.{js,cjs,mjs,jsx,json,md,css}': ['prettier --write'],
}
