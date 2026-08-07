/** @type {import('next').NextConfig} */
const nextConfig = {
  // @repo/ui ships raw .tsx source (no build step / no .d.ts), so transpile it.
  transpilePackages: ['@repo/ui'],
}

export default nextConfig
