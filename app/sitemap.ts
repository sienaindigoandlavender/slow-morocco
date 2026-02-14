import { MetadataRoute } from 'next'
import { getJourneys, getStories, getPlaces, getDayTrips } from '@/lib/supabase'

const BASE_URL = 'https://www.slowmorocco.com'

/**
 * Ensure a slug is safe for use in XML sitemap URLs.
 * URL-encodes characters that break XML parsing (especially &).
 * The encoded URL is valid in both XML and browser navigation.
 */
function safeSitemapUrl(base: string, prefix: string, slug: string): string {
  // Encode the slug portion to handle & and other special chars
  // encodeURIComponent turns & into %26 which is XML-safe
  const encodedSlug = encodeURIComponent(slug)
    .replace(/%2F/g, '/')  // preserve any intentional slashes
  return `${base}${prefix}/${encodedSlug}`
}

// Static pages with their priorities
const STATIC_PAGES = [
  { path: '', priority: 1, changeFrequency: 'weekly' as const },
  { path: '/journeys', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/stories', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/places', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/plan-your-trip', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/manifesto', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/faq', priority: 0.6, changeFrequency: 'monthly' as const },
  { path: '/contact', priority: 0.6, changeFrequency: 'monthly' as const },
  { path: '/whats-included', priority: 0.6, changeFrequency: 'monthly' as const },
  { path: '/visa-info', priority: 0.5, changeFrequency: 'monthly' as const },
  { path: '/day-trips', priority: 0.7, changeFrequency: 'weekly' as const },
  { path: '/guides', priority: 0.6, changeFrequency: 'monthly' as const },
  { path: '/epic', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/glossary', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/overnight/agafay-desert', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/health-safety', priority: 0.4, changeFrequency: 'yearly' as const },
  { path: '/travel-insurance', priority: 0.4, changeFrequency: 'yearly' as const },
  { path: '/cancellation-policy', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/disclaimer', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/intellectual-property', priority: 0.3, changeFrequency: 'yearly' as const },
]

async function getDynamicPages() {
  const dynamicPages: MetadataRoute.Sitemap = []

  try {
    const journeys = await getJourneys({ published: true })
    journeys.forEach((journey) => {
      if (journey.slug) {
        dynamicPages.push({
          url: safeSitemapUrl(BASE_URL, '/journeys', journey.slug),
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        })
      }
    })
  } catch (e) {
    console.error('Failed to fetch journeys for sitemap:', e)
  }

  try {
    const stories = await getStories({ published: true })
    stories.forEach((story) => {
      if (story.slug) {
        dynamicPages.push({
          url: safeSitemapUrl(BASE_URL, '/story', story.slug),
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        })
      }
    })
  } catch (e) {
    console.error('Failed to fetch stories for sitemap:', e)
  }

  try {
    const places = await getPlaces({ published: true })
    places.forEach((place) => {
      if (place.slug) {
        dynamicPages.push({
          url: safeSitemapUrl(BASE_URL, '/places', place.slug),
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      }
    })
  } catch (e) {
    console.error('Failed to fetch places for sitemap:', e)
  }

  try {
    const dayTrips = await getDayTrips({ published: true })
    dayTrips.forEach((trip) => {
      if (trip.slug) {
        dynamicPages.push({
          url: safeSitemapUrl(BASE_URL, '/day-trips', trip.slug),
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        })
      }
    })
  } catch (e) {
    console.error('Failed to fetch day trips for sitemap:', e)
  }

  return dynamicPages
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = STATIC_PAGES.map((page) => ({
    url: `${BASE_URL}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))

  // Dynamic pages from Supabase
  const dynamicPages = await getDynamicPages()

  return [...staticPages, ...dynamicPages]
}
