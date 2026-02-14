"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import PageBanner from "@/components/PageBanner";

interface Story {
  slug: string;
  title: string;
  subtitle?: string;
  mood?: string;
  heroImage?: string;
  excerpt?: string;
}

interface StoriesContentProps {
  initialStories: Story[];
  dataLoaded?: boolean;
}

const STORIES_PER_PAGE = 12;

export default function StoriesContent({
  initialStories,
  dataLoaded = true,
}: StoriesContentProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filters = [
    { id: "all", label: "All" },
    { id: "fierce", label: "Fierce" },
    { id: "tender", label: "Tender" },
    { id: "sacred", label: "Sacred" },
    { id: "golden", label: "Golden" },
  ];

  // Filter and search stories
  const filteredStories = useMemo(() => {
    let result = initialStories;

    // Apply mood filter
    if (activeFilter !== "all") {
      result = result.filter(
        (s) => s.mood?.toLowerCase() === activeFilter.toLowerCase()
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.subtitle?.toLowerCase().includes(query) ||
          s.excerpt?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [initialStories, activeFilter, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredStories.length / STORIES_PER_PAGE);
  const startIndex = (currentPage - 1) * STORIES_PER_PAGE;
  const paginatedStories = filteredStories.slice(
    startIndex,
    startIndex + STORIES_PER_PAGE
  );

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  // Reset to page 1 when filter or search changes
  const handleFilterChange = (id: string) => {
    setActiveFilter(id);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Immersive Hero Banner */}
      <PageBanner
        slug="stories"
        fallback={{
          title: "Stories worth knowing",
          subtitle:
            "The history, craft, and culture that make Morocco make sense. Understanding its layers transforms a trip into a revelation.",
          label: "The Edit",
        }}
      />

      {/* Search Bar */}
      <section className="py-8 md:py-10">
        <div className="container mx-auto px-8 md:px-16 lg:px-20">
          <div className="max-w-md">
            <div className="relative">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
              <input
                type="text"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-transparent border-b border-foreground/20 py-3 pl-8 pr-4 text-foreground placeholder:text-foreground/40 focus:border-foreground focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-4 border-b border-border sticky top-20 md:top-24 bg-background z-40">
        <div className="container mx-auto px-8 md:px-16 lg:px-20">
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => handleFilterChange(filter.id)}
                className={`text-[11px] tracking-[0.15em] uppercase whitespace-nowrap pb-1 transition-colors ${
                  activeFilter === filter.id
                    ? "text-foreground border-b border-foreground"
                    : "text-foreground/40 hover:text-foreground/70"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content — always rendered for crawlers */}
      <section className="py-10 md:py-12">
        <div className="container mx-auto px-8 md:px-16 lg:px-20">
          <div className="max-w-3xl">
            <p className="text-foreground/60 leading-relaxed">
              Cultural essays, artisan profiles, and deep-cuts from twenty years in Morocco. Each story explores a thread of the country's living heritage—from Gnawa music and Amazigh weaving traditions to the architecture of Fes and the silence of the Sahara.
            </p>
          </div>
        </div>
      </section>

      {/* Stories */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-8 md:px-16 lg:px-20">
          {!dataLoaded ? (
            <div className="py-12 max-w-3xl">
              <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-6">Explore Our Stories</h2>
              <div className="space-y-4 text-foreground/70 leading-relaxed">
                <p><strong className="text-foreground">Fierce</strong> — Stories of resilience, resistance, and the raw edges of Moroccan history and identity.</p>
                <p><strong className="text-foreground">Tender</strong> — Intimate portraits of craft, family, and the quiet traditions that hold communities together.</p>
                <p><strong className="text-foreground">Sacred</strong> — The spiritual dimensions of Morocco—Sufi shrines, Gnawa ceremonies, and the spaces where faith lives.</p>
                <p><strong className="text-foreground">Golden</strong> — Light, beauty, and the moments where Morocco reveals itself as something extraordinary.</p>
              </div>
            </div>
          ) : filteredStories.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-foreground/50 mb-4">
                {searchQuery
                  ? "No stories match your search."
                  : "No stories match this filter."}
              </p>
              <button
                onClick={() => {
                  setActiveFilter("all");
                  setSearchQuery("");
                }}
                className="text-sm underline text-foreground/60 hover:text-foreground transition-colors"
              >
                View all stories
              </button>
            </div>
          ) : (
            <>
              {/* Stories Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {paginatedStories.map((story) => (
                  <article key={story.slug} itemScope itemType="https://schema.org/Article">
                    <Link
                      href={`/story/${story.slug}`}
                      className="group"
                    >
                      <div className="aspect-[3/4] relative overflow-hidden bg-[#d4cdc4] mb-5">
                        {story.heroImage && (
                          <Image
                            src={story.heroImage}
                            alt={story.title}
                            fill
                            className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                            itemProp="image"
                          />
                        )}
                      </div>
                      {story.mood && (
                        <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-2">
                          {story.mood}
                        </p>
                      )}
                      <h3 className="font-serif text-xl mb-2 group-hover:text-foreground/70 transition-colors" itemProp="headline">
                        {story.title}
                      </h3>
                      {story.excerpt && (
                        <p className="text-sm text-foreground/60 leading-relaxed line-clamp-2" itemProp="description">
                          {story.excerpt}
                        </p>
                      )}
                    </Link>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-20">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 text-sm ${
                      currentPage === 1
                        ? "text-foreground/20 cursor-not-allowed"
                        : "text-foreground/60 hover:text-foreground"
                    }`}
                  >
                    ←
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      const showPage =
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1;
                      const showEllipsisBefore =
                        page === currentPage - 2 && currentPage > 3;
                      const showEllipsisAfter =
                        page === currentPage + 2 && currentPage < totalPages - 2;

                      if (showEllipsisBefore || showEllipsisAfter) {
                        return (
                          <span key={page} className="px-2 text-foreground/30">
                            …
                          </span>
                        );
                      }

                      if (!showPage) return null;

                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`w-10 h-10 text-sm transition-colors ${
                            currentPage === page
                              ? "border-b-2 border-foreground text-foreground font-medium"
                              : "text-foreground/40 hover:text-foreground"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                  )}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 text-sm ${
                      currentPage === totalPages
                        ? "text-foreground/20 cursor-not-allowed"
                        : "text-foreground/60 hover:text-foreground"
                    }`}
                  >
                    →
                  </button>
                </div>
              )}

              {/* Results count */}
              <p className="text-center text-sm text-foreground/40 mt-8">
                Showing {startIndex + 1}–
                {Math.min(startIndex + STORIES_PER_PAGE, filteredStories.length)}{" "}
                of {filteredStories.length} stories
              </p>
            </>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 md:py-28 bg-[#f5f2ed]">
        <div className="container mx-auto px-8 md:px-16 lg:px-20 text-center max-w-2xl">
          <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-4">
            Stay Curious
          </p>
          <h2 className="font-serif text-3xl md:text-4xl mb-6">
            Get stories in your inbox
          </h2>
          <p className="text-foreground/60 mb-10 text-sm">
            New stories, cultural insights, and journey inspiration. No spam,
            just depth.
          </p>
          <Link
            href="/contact"
            className="inline-block border border-foreground px-10 py-4 text-xs tracking-[0.15em] uppercase hover:bg-foreground hover:text-background transition-colors"
          >
            Subscribe
          </Link>
        </div>
      </section>
    </div>
  );
}
