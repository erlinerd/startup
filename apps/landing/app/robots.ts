import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // The API is a demo endpoint, not indexable content.
        disallow: ['/api/'],
      },
    ],
    sitemap: 'https://starter.erlinerd.com/sitemap.xml',
    host: 'https://starter.erlinerd.com',
  }
}
