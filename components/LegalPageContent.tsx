"use client";

import { useEffect, useState } from "react";

interface LegalSection {
  page_id: string;
  page_title: string;
  section_order: number;
  section_title: string;
  section_content: string;
}

interface LegalPageContentProps {
  pageId: string;
  fallbackTitle: string;
}

export default function LegalPageContent({
  pageId,
  fallbackTitle,
}: LegalPageContentProps) {
  const [sections, setSections] = useState<LegalSection[]>([]);
  const [title, setTitle] = useState(fallbackTitle);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchLegal() {
      try {
        const res = await fetch(`/api/legal?page=${pageId}`);
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setTitle(data.page_title || fallbackTitle);
        setSections(data.sections || []);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchLegal();
  }, [pageId, fallbackTitle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-32 pb-24">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-foreground/5 rounded w-1/3" />
            <div className="h-4 bg-foreground/5 rounded w-full" />
            <div className="h-4 bg-foreground/5 rounded w-5/6" />
            <div className="h-4 bg-foreground/5 rounded w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  if (error || sections.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-32 pb-24">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-8">
            {fallbackTitle}
          </h1>
          <p className="text-foreground/60">
            This page is currently being updated. Please check back shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-24">
      <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-8">
          {title}
        </h1>

        <div className="space-y-8">
          {sections.map((section, i) => (
            <section key={i}>
              <h2 className="font-serif text-2xl text-foreground mb-4">
                {section.section_title}
              </h2>
              <div className="text-foreground/70 leading-relaxed whitespace-pre-line">
                {section.section_content}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
