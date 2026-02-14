'use client';

import React from 'react';
import { linkGlossaryTermsText } from '@/lib/glossary-linker';
import { linkDerbTermsText } from '@/lib/derb-linker';

interface StoryBodyProps {
  content: string;
}

// Combined linker: first applies derb.so links, then glossary links to remaining text
function linkAllTerms(text: string): React.ReactNode {
  // Get derb-linked result (React nodes)
  const derbResult = linkDerbTermsText(text);
  
  // If derb linker didn't find anything, just use glossary linker
  if (typeof derbResult === 'string') {
    return linkGlossaryTermsText(derbResult);
  }
  
  // If derb linker returned null/undefined, fallback to glossary
  if (!derbResult || !React.isValidElement(derbResult)) {
    return linkGlossaryTermsText(text);
  }

  // If derb linker returned fragments, apply glossary linker to string parts only
  const children = React.Children.toArray((derbResult as React.ReactElement).props.children);
  return (
    <>
      {children.map((child, i) => {
        if (typeof child === 'string') {
          return <React.Fragment key={i}>{linkGlossaryTermsText(child)}</React.Fragment>;
        }
        return child; // Already a link element from derb linker
      })}
    </>
  );
}

export default function StoryBody({ content }: StoryBodyProps) {
  if (!content) return null;

  // Split by double newlines for paragraphs
  const paragraphs = content.split(/\n\n+/).filter(Boolean);

  return (
    <div className="prose prose-lg max-w-none">
      {paragraphs.map((paragraph, index) => {
        // Check if it's a blockquote (starts with >)
        if (paragraph.trim().startsWith('>')) {
          const quoteText = paragraph.trim().replace(/^>\s*/, '');
          return (
            <blockquote
              key={index}
              className="border-l-2 border-foreground/20 pl-6 my-8 text-xl italic text-foreground/70"
            >
              {linkAllTerms(quoteText)}
            </blockquote>
          );
        }

        // Check if it's a heading (starts with ##)
        if (paragraph.trim().startsWith('## ')) {
          const headingText = paragraph.trim().replace(/^##\s*/, '');
          return (
            <h2
              key={index}
              className="font-serif text-2xl text-foreground mt-12 mb-6"
            >
              {headingText}
            </h2>
          );
        }

        // Regular paragraph - link glossary terms
        return (
          <p
            key={index}
            className="text-foreground/70 leading-relaxed mb-6"
          >
            {linkAllTerms(paragraph)}
          </p>
        );
      })}
    </div>
  );
}
