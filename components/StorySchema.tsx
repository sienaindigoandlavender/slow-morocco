interface StorySchemaProps {
  title: string;
  slug: string;
  excerpt: string;
  heroImage: string;
  category: string;
  datePublished?: string;
  dateModified?: string;
}

export default function StorySchema({
  title,
  slug,
  excerpt,
  heroImage,
  category,
  datePublished = "2025-01-01",
  dateModified,
}: StorySchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": excerpt,
    "image": heroImage,
    "author": {
      "@type": "Person",
      "name": "Jacqueline Ng",
      "url": "https://www.slowmorocco.com/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Slow Morocco",
      "url": "https://www.slowmorocco.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.slowmorocco.com/apple-touch-icon.png"
      }
    },
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.slowmorocco.com/stories/${slug}`
    },
    "articleSection": category,
    "inLanguage": "en"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
