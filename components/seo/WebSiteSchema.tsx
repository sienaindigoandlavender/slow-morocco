export default function WebSiteSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.slowmorocco.com/#website",
    name: "Slow Morocco",
    alternateName: "Slow Morocco - Private Cultural Journeys",
    url: "https://www.slowmorocco.com",
    description: "Thoughtful private journeys across Morocco — designed for travellers who prefer depth over speed.",
    publisher: {
      "@type": "Organization",
      "@id": "https://www.slowmorocco.com/#organization",
      name: "Slow Morocco",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.slowmorocco.com/glossary?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: "en",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
