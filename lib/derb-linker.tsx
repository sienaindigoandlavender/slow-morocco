// Derb.so Auto-Linker
// Scans text and wraps Morocco travel concepts with links to derb.so questions
// Only links each term once per text block to avoid over-linking
// External links use rel="noopener" and open in same tab (SEO juice flows)

import Link from 'next/link';
import React from 'react';

interface DerbLink {
  pattern: string;
  url: string;
}

// Map phrases to derb.so question URLs
const derbLinks: DerbLink[] = [
  // Sorted longest first for matching priority
  { pattern: "call to prayer", url: "https://derb.so/questions/why-is-it-so-loud-at-430am" },
  { pattern: "tourist tax", url: "https://derb.so/questions/what-is-the-tourist-tax" },
  { pattern: "tourist police", url: "https://derb.so/questions/what-is-the-police-touristique" },
  { pattern: "police touristique", url: "https://derb.so/questions/what-is-the-police-touristique" },
  { pattern: "petit taxi", url: "https://derb.so/questions/how-do-i-get-a-petit-taxi-to-use-the-meter" },
  { pattern: "grand taxi", url: "https://derb.so/questions/whats-the-difference-between-petit-and-grand-taxis" },
  { pattern: "mint tea", url: "https://derb.so/questions/why-does-mint-tea-taste-different-here" },
  { pattern: "tap water", url: "https://derb.so/questions/can-i-drink-the-tap-water" },
  { pattern: "Eid al-Adha", url: "https://derb.so/questions/what-is-eid-al-adha" },
  { pattern: "Eid al-Fitr", url: "https://derb.so/questions/when-are-public-holidays" },
  { pattern: "public holiday", url: "https://derb.so/questions/when-are-public-holidays" },
  { pattern: "public holidays", url: "https://derb.so/questions/when-are-public-holidays" },
  { pattern: "horse carriage", url: "https://derb.so/questions/should-i-take-a-horse-carriage" },
  { pattern: "calèche", url: "https://derb.so/questions/should-i-take-a-horse-carriage" },
  { pattern: "Ramadan", url: "https://derb.so/questions/what-is-ramadan" },
  { pattern: "bargaining", url: "https://derb.so/questions/how-does-bargaining-work" },
  { pattern: "haggling", url: "https://derb.so/questions/how-does-bargaining-work" },
  { pattern: "Balak", url: "https://derb.so/questions/what-does-balak-mean" },
  { pattern: "SPANA", url: "https://derb.so/questions/should-i-take-a-horse-carriage" },
];

// Build regex - sort by length (longest first)
const sortedPatterns = [...derbLinks].sort((a, b) => b.pattern.length - a.pattern.length);
const derbPattern = new RegExp(
  `\\b(${sortedPatterns.map(l => l.pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
  'gi'
);
const patternMap = new Map(derbLinks.map(l => [l.pattern.toLowerCase(), l.url]));

/**
 * For plain text - returns React elements with derb.so links
 * Use alongside glossary linker in StoryBody
 */
export function linkDerbTermsText(text: string): React.ReactNode {
  if (!text) return text;

  const linkedTerms = new Set<string>();
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  const matches: { index: number; length: number; match: string; url: string }[] = [];

  let match;
  const regex = new RegExp(derbPattern.source, 'gi');

  while ((match = regex.exec(text)) !== null) {
    const lowerMatch = match[0].toLowerCase();
    const url = patternMap.get(lowerMatch);

    if (url && !linkedTerms.has(lowerMatch)) {
      linkedTerms.add(lowerMatch);
      matches.push({
        index: match.index,
        length: match[0].length,
        match: match[0],
        url,
      });
    }
  }

  matches.forEach((m, i) => {
    if (m.index > lastIndex) {
      parts.push(text.slice(lastIndex, m.index));
    }
    parts.push(
      <a
        key={`derb-${i}`}
        href={m.url}
        className="derb-link"
        rel="noopener"
      >
        {m.match}
      </a>
    );
    lastIndex = m.index + m.length;
  });

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? <>{parts}</> : text;
}

/**
 * For HTML content - returns HTML string with derb.so links
 */
export function linkDerbTermsHTML(html: string): string {
  if (!html) return html;

  const linkedTerms = new Set<string>();
  const parts = html.split(/(<[^>]+>)/);

  let inAnchor = false;
  let inHeading = false;

  const processed = parts.map(part => {
    if (part.startsWith('<')) {
      const lp = part.toLowerCase();
      if (lp.startsWith('<a ') || lp === '<a>') inAnchor = true;
      if (lp.startsWith('</a')) inAnchor = false;
      if (lp.match(/^<h[1-6]/)) inHeading = true;
      if (lp.match(/^<\/h[1-6]/)) inHeading = false;
      return part;
    }

    if (inAnchor || inHeading) return part;

    return part.replace(derbPattern, (match) => {
      const lm = match.toLowerCase();
      const url = patternMap.get(lm);
      if (!url) return match;
      if (linkedTerms.has(lm)) return match;
      linkedTerms.add(lm);
      return `<a href="${url}" class="derb-link" rel="noopener">${match}</a>`;
    });
  });

  return processed.join('');
}
