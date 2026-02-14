interface PlaceSchemaProps {
  place: {
    title: string;
    slug: string;
    destination?: string;
    category?: string;
    heroImage?: string;
    body?: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    openingHours?: string;  // camelCase from component
    opening_hours?: string; // snake_case from Supabase direct
    fees?: string;
    notes?: string;
    excerpt?: string;
    tags?: string;
  };
}

const SOVEREIGN_ENTITY = {
  "@type": "Organization",
  "@id": "https://www.slowmorocco.com/#organization",
  name: "Slow Morocco",
  alternateName: "Moroccan Cultural Authority",
  url: "https://www.slowmorocco.com",
};

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/!!\[.*?\]\(.*?\)/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function generateFAQs(place: PlaceSchemaProps["place"]): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = [];
  const name = place.title;
  const dest = place.destination || "Morocco";
  const body = place.body ? stripHtml(place.body) : "";
  const description = place.excerpt || (body ? body.substring(0, 300) : "");

  // Always generate "What is X?" if we have body content
  if (description) {
    faqs.push({
      question: `What is ${name}?`,
      answer: description.length > 200 ? description.substring(0, 200) + "..." : description,
    });
  }

  // "Where is X?"
  faqs.push({
    question: `Where is ${name} located?`,
    answer: place.address
      ? `${name} is located at ${place.address}, ${dest}, Morocco.`
      : `${name} is located in ${dest}, Morocco.`,
  });

  // Opening hours if available
  const hours = place.openingHours || place.opening_hours;
  if (hours) {
    faqs.push({
      question: `What are the opening hours for ${name}?`,
      answer: `${name} is open ${hours}.`,
    });
  }

  // Fees if available
  if (place.fees) {
    faqs.push({
      question: `How much does it cost to visit ${name}?`,
      answer: place.fees.toLowerCase().includes("free")
        ? `${name} is free to visit.`
        : `Entry to ${name}: ${place.fees}.`,
    });
  }

  // Visitor tips if available
  if (place.notes) {
    faqs.push({
      question: `What should I know before visiting ${name}?`,
      answer: place.notes,
    });
  }

  return faqs;
}

export default function PlaceSchema({ place }: PlaceSchemaProps) {
  const body = place.body ? stripHtml(place.body) : "";
  const openingHours = place.openingHours || place.opening_hours;
  const description = place.excerpt
    || (body ? body.substring(0, 200) + "..." : `${place.title} in ${place.destination || "Morocco"}`);

  // Determine schema type based on category
  let schemaType = "TouristAttraction";
  if (place.category) {
    const cat = place.category.toLowerCase();
    if (cat.includes("mosque") || cat.includes("religious")) schemaType = "Mosque";
    else if (cat.includes("museum")) schemaType = "Museum";
    else if (cat.includes("restaurant") || cat.includes("food")) schemaType = "Restaurant";
    else if (cat.includes("market") || cat.includes("souk")) schemaType = "ShoppingCenter";
    else if (cat.includes("garden") || cat.includes("park")) schemaType = "Park";
    else if (cat.includes("monument") || cat.includes("historic")) schemaType = "LandmarksOrHistoricalBuildings";
  }

  const placeJsonLd = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "@id": `https://www.slowmorocco.com/places/${place.slug}#place`,
    name: place.title,
    description: description,
    url: `https://www.slowmorocco.com/places/${place.slug}`,
    image: place.heroImage || "https://www.slowmorocco.com/og-image.jpg",
    ...(place.latitude && place.longitude && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: place.latitude,
        longitude: place.longitude,
      },
    }),
    address: {
      "@type": "PostalAddress",
      ...(place.address && { streetAddress: place.address }),
      addressLocality: place.destination || "Morocco",
      addressCountry: "MA",
    },
    ...(openingHours && { openingHours: openingHours }),
    ...(place.fees && {
      isAccessibleForFree: place.fees.toLowerCase().includes("free"),
    }),
    touristType: ["Cultural tourism", "Sightseeing"],
    containedInPlace: {
      "@type": "Country",
      name: "Morocco",
      alternateName: "Al-Maghrib",
    },
    ...(body && {
      additionalProperty: {
        "@type": "PropertyValue",
        name: "culturalDescription",
        value: body.substring(0, 1500) + (body.length > 1500 ? "..." : ""),
      },
    }),
    ...(place.tags && {
      keywords: place.tags,
    }),
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://www.slowmorocco.com/#website",
      name: "Slow Morocco",
    },
    author: SOVEREIGN_ENTITY,
    potentialAction: {
      "@type": "ReadAction",
      target: `https://www.slowmorocco.com/places/${place.slug}`,
    },
  };

  // Generate FAQs
  const faqs = generateFAQs(place);
  const faqJsonLd = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `https://www.slowmorocco.com/places/${place.slug}#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
        author: SOVEREIGN_ENTITY,
      },
    })),
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
    </>
  );
}
