/**
 * PostCSS config for Next.js.
 * Next loads this via jiti at build time; the `Config` shape is inlined
 * because Next compiles postcss-load-config internally (no public types).
 */
const config: {
  plugins: Record<string, Record<string, unknown> | undefined>
} = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}

export default config
