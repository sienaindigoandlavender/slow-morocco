"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import HeroSearch from "@/components/HeroSearch";

interface Journey {
  slug: string;
  title: string;
  description?: string;
  heroImage?: string;
  duration?: string;
  destinations?: string;
  journeyType?: string;
  price?: number;
  epicPrice?: number;
}

interface Story {
  slug: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  heroImage?: string;
  mood?: string;
}

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  journeyTitle?: string;
}

interface HomeContentProps {
  journeys: Journey[];
  epicJourneys: Journey[];
  stories: Story[];
  testimonials: Testimonial[];
  settings: Record<string, string>;
}

export default function HomeContent({
  journeys,
  epicJourneys,
  stories,
  testimonials,
  settings,
}: HomeContentProps) {
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const nextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const heroImage = settings.hero_image_url;

  return (
    <div className="bg-background min-h-screen">
      {/* ═══════════════════════════════════════════════════════════════
          HERO: Full-bleed immersive with text overlay
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative h-screen">
        {heroImage ? (
          <Image
            src={heroImage}
            alt="Private cultural journeys through Morocco - desert landscapes, ancient medinas, and Atlas Mountains"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-[#8B7355]" />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-8 md:px-16 lg:px-20 pb-20 md:pb-28">
            <div className="max-w-2xl">
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/60 mb-4">
                Cultural Journeys
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] mb-6">
                Morocco moves<br />at its own pace
              </h1>
              <p className="text-white/80 leading-relaxed mb-8 text-sm md:text-base max-w-lg">
                Private routes through ancient medinas, across high atlas passes, 
                into desert silence. Every journey shaped around what matters to you.
              </p>
              <Link
                href="/plan-your-trip"
                className="inline-flex items-center gap-3 text-xs tracking-[0.15em] uppercase text-white group"
              >
                <span className="border-b border-white/50 pb-1 group-hover:border-white transition-colors">
                  Begin your journey
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <HeroSearch />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          STATEMENT: Large typography section
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container mx-auto px-8 md:px-16 lg:px-20">
          <div className="max-w-4xl">
            <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-8">
              Our Philosophy
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.2] text-foreground/80">
              We don&apos;t do bucket lists. We build routes that let Morocco reveal 
              itself—<span className="italic">slowly</span>, on its own terms, 
              through the people and places that make it unforgettable.
            </h2>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          JOURNEYS: Clean carousel layout
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-sand">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
              Explore More
            </p>
            <h2 className="text-2xl md:text-3xl tracking-[0.15em] font-light mb-4">
              Routes Worth Taking
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Private journeys shaped around what matters to you
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <button
              onClick={() => {
                const container = document.getElementById('home-journeys-carousel');
                if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
              }}
              className="absolute -left-4 top-1/3 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-background/80 border border-foreground/10 flex items-center justify-center hover:bg-background hover:border-foreground/20 transition-all opacity-70 hover:opacity-100"
              aria-label="Previous"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="10,3 5,8 10,13" />
              </svg>
            </button>

            <div
              id="home-journeys-carousel"
              className="flex gap-6 overflow-x-auto scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {journeys.map((journey) => (
                <Link
                  key={journey.slug}
                  href={`/journeys/${journey.slug}`}
                  className="group flex-shrink-0 w-[280px]"
                >
                  <div className="relative aspect-[4/5] mb-4 overflow-hidden bg-[#e8e0d4]">
                    {journey.heroImage && (
                      <Image
                        src={journey.heroImage}
                        alt={`${journey.title} - ${journey.duration || 'multi-day'} private Morocco journey`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    )}
                  </div>
                  <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-1">
                    {journey.duration || "Multi-day"}
                  </p>
                  <h3 className="font-serif text-lg group-hover:opacity-70 transition-opacity">
                    {journey.title}
                  </h3>
                </Link>
              ))}
            </div>

            <button
              onClick={() => {
                const container = document.getElementById('home-journeys-carousel');
                if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
              }}
              className="absolute -right-4 top-1/3 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-background/80 border border-foreground/10 flex items-center justify-center hover:bg-background hover:border-foreground/20 transition-all opacity-70 hover:opacity-100"
              aria-label="Next"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="6,3 11,8 6,13" />
              </svg>
            </button>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/journeys"
              className="text-xs tracking-[0.2em] uppercase border-b border-foreground pb-1 hover:opacity-60 transition-opacity"
            >
              View All Journeys
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          EPIC JOURNEYS: Showcase epic journeys
          ═══════════════════════════════════════════════════════════════ */}
      {epicJourneys.length > 0 && (
        <section className="py-20 md:py-28 bg-[#1a1916] text-white">
          <div className="container mx-auto px-8 md:px-16 lg:px-20">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-4">
                  Epic Journeys
                </p>
                <h2 className="font-serif text-3xl md:text-4xl">
                  For those who want it all
                </h2>
                <p className="text-white/60 mt-4 max-w-lg text-sm leading-relaxed">
                  Extended itineraries spanning 10-21 days. These are the journeys that 
                  let Morocco truly unfold—across mountain passes, through hidden valleys, 
                  into the deep Sahara.
                </p>
              </div>
              <Link
                href="/epic"
                className="mt-6 md:mt-0 text-xs tracking-[0.15em] uppercase text-white/60 hover:text-white transition-colors"
              >
                View all epic journeys →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {epicJourneys.slice(0, 3).map((journey) => (
                <Link
                  key={journey.slug}
                  href={`/journeys/${journey.slug}`}
                  className="group"
                >
                  <div className="aspect-[4/5] relative overflow-hidden mb-4">
                    {journey.heroImage ? (
                      <Image
                        src={journey.heroImage}
                        alt={journey.title}
                        fill
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-white/10" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-[10px] tracking-[0.3em] uppercase text-white/70 mb-2">
                        {journey.duration}
                      </p>
                      <h3 className="font-serif text-xl text-white">
                        {journey.title}
                      </h3>
                    </div>
                  </div>
                  {journey.description && (
                    <p className="text-sm text-white/70 leading-relaxed line-clamp-2">
                      {journey.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>

            {epicJourneys.length > 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-6 md:mt-8">
                {epicJourneys.slice(3, 5).map((journey) => (
                  <Link
                    key={journey.slug}
                    href={`/journeys/${journey.slug}`}
                    className="group"
                  >
                    <div className="aspect-[16/9] relative overflow-hidden mb-4">
                      {journey.heroImage ? (
                        <Image
                          src={journey.heroImage}
                          alt={journey.title}
                          fill
                          className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-white/10" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <p className="text-[10px] tracking-[0.3em] uppercase text-white/70 mb-2">
                          {journey.duration}
                        </p>
                        <h3 className="font-serif text-2xl text-white">
                          {journey.title}
                        </h3>
                      </div>
                    </div>
                    {journey.description && (
                      <p className="text-sm text-white/70 leading-relaxed line-clamp-2">
                        {journey.description}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          STORIES: Magazine grid layout
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-8 md:px-16 lg:px-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-4">
                The Edit
              </p>
              <h2 className="font-serif text-3xl md:text-4xl">
                Stories worth knowing
              </h2>
            </div>
            <Link
              href="/stories"
              className="mt-6 md:mt-0 text-xs tracking-[0.15em] uppercase text-foreground/60 hover:text-foreground transition-colors"
            >
              All stories →
            </Link>
          </div>

          {stories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stories.map((story) => (
                <Link
                  key={story.slug}
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
                      />
                    )}
                  </div>
                  {story.mood && (
                    <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-2">
                      {story.mood}
                    </p>
                  )}
                  <h3 className="font-serif text-xl mb-2 group-hover:text-foreground/70 transition-colors">
                    {story.title}
                  </h3>
                  {story.excerpt && (
                    <p className="text-sm text-foreground/60 leading-relaxed line-clamp-2">
                      {story.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-foreground/40 italic">Stories coming soon...</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          TESTIMONIALS: What travelers say
          ═══════════════════════════════════════════════════════════════ */}
      {testimonials.length > 0 && (
        <section className="py-20 md:py-28 bg-[#f5f2ed]">
          <div className="container mx-auto px-8 md:px-16 lg:px-20">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-4">
                  What Travelers Say
                </p>
              </div>

              <div className="flex items-center gap-8">
                <button
                  onClick={prevTestimonial}
                  className="p-2 border border-border rounded-full hover:bg-background transition-colors hidden md:flex items-center justify-center flex-shrink-0"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="text-center flex-grow">
                  <blockquote className="font-serif text-xl md:text-2xl lg:text-3xl leading-relaxed text-foreground/80 mb-6">
                    &ldquo;{testimonials[testimonialIndex]?.quote}&rdquo;
                  </blockquote>
                  <p className="text-xs tracking-[0.2em] uppercase text-foreground/50">
                    — {testimonials[testimonialIndex]?.author}
                  </p>
                </div>

                <button
                  onClick={nextTestimonial}
                  className="p-2 border border-border rounded-full hover:bg-background transition-colors hidden md:flex items-center justify-center flex-shrink-0"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setTestimonialIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === testimonialIndex ? "bg-foreground/60" : "bg-foreground/20"
                    }`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          HOW IT WORKS: Horizontal timeline
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-[#1a1916] text-white">
        <div className="container mx-auto px-8 md:px-16 lg:px-20">
          <div className="text-center mb-16 md:mb-20">
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-4">
              The Process
            </p>
            <h2 className="font-serif text-3xl md:text-4xl">
              How it works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 max-w-5xl mx-auto">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-6">
                <span className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center font-serif text-lg">1</span>
                <div className="hidden md:block flex-1 h-px bg-white/10 ml-4" />
              </div>
              <h3 className="font-serif text-xl mb-3">You reach out</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Tell us what&apos;s calling you. A journey that caught your eye. A question. 
                A sense that something here is yours.
              </p>
            </div>

            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-6">
                <span className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center font-serif text-lg">2</span>
                <div className="hidden md:block flex-1 h-px bg-white/10 ml-4" />
              </div>
              <h3 className="font-serif text-xl mb-3">We shape it</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                We build the route around what matters to you. Add days. Remove cities. 
                Stay longer where something pulls you.
              </p>
            </div>

            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-6">
                <span className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center font-serif text-lg">3</span>
              </div>
              <h3 className="font-serif text-xl mb-3">You go</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Deposit secures your dates. Balance due 60 days before. 
                Then you pack light and show up.
              </p>
            </div>
          </div>

          <div className="text-center mt-16 md:mt-20">
            <Link
              href="/plan-your-trip"
              className="inline-block bg-white text-[#1a1916] px-10 py-4 text-xs tracking-[0.15em] uppercase hover:bg-white/90 transition-colors"
            >
              Start the conversation
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FINAL CTA: Simple, editorial
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container mx-auto px-8 md:px-16 lg:px-20 text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6">
            Ready to go slowly?
          </h2>
          <p className="text-foreground/60 max-w-lg mx-auto mb-10 text-sm leading-relaxed">
            No forms. No packages. Just a conversation about what you&apos;re hoping to find.
          </p>
          <Link
            href="/plan-your-trip"
            className="inline-block border border-foreground px-10 py-4 text-xs tracking-[0.15em] uppercase hover:bg-foreground hover:text-background transition-colors"
          >
            Plan your trip
          </Link>
        </div>
      </section>
    </div>
  );
}
