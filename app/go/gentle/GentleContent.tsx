"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Phone, Mail } from "lucide-react";

interface Journey {
  id: string;
  title: string;
  slug: string;
  heroImage: string;
  tagline: string;
  description: string;
  duration: number;
  price: number;
  cities: string;
  highlights: string[];
  accessibilityNotes: string[];
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  quote: string;
  bio: string;
  image: string;
}

interface Settings {
  heroTitle: string;
  heroSubtitle: string;
  heroTagline: string;
  founderNoteTitle: string;
  founderNoteBody: string;
  whatsappUrl: string;
  whatsappNumber: string;
  contactEmail: string;
  requirements: { title: string; description: string }[];
  promises: { title: string; description: string }[];
}

interface GentleContentProps {
  initialExperiences: Journey[];
  initialTeam: TeamMember[];
  initialSettings: Settings;
}

export default function GentleContent({
  initialExperiences,
  initialTeam,
  initialSettings,
}: GentleContentProps) {
  const [experiences] = useState<Journey[]>(initialExperiences);
  const [team] = useState<TeamMember[]>(initialTeam);
  const [settings] = useState<Settings>(initialSettings);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const formatPhoneNumber = (num: string) => {
    const cleaned = num.replace(/\D/g, "");
    if (cleaned.startsWith("212")) {
      return `+212 ${cleaned.slice(3, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10)}`.trim();
    }
    return num;
  };

  return (
    <main className="bg-[#FAF7F2] text-[#1a1a1a] min-h-screen" role="main" aria-label="Accessible Morocco Tours">
      {/* Hidden H1 for SEO */}
      <h1 className="sr-only">Accessible Morocco Tours - Gentle Journeys for Mobility Challenges</h1>
      
      {/* Minimal Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-sm border-b border-[#1a1a1a]/5">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-serif text-sm tracking-[0.12em] text-[#1a1a1a]/80 hover:text-[#1a1a1a] transition-colors">
              S L O W &nbsp; M O R O C C O
            </Link>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-xs tracking-[0.15em] uppercase text-[#1a1a1a]/50 hover:text-[#1a1a1a] transition-colors"
            >
              Get in Touch
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-[#1a1a1a]/40 mb-6">
              {settings.heroTagline}
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif italic leading-tight mb-8">
              {settings.heroTitle}
            </h2>
            <p className="text-lg text-[#1a1a1a]/60 leading-relaxed max-w-2xl mx-auto">
              {settings.heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Experiences Grid */}
      <section className="py-12 md:py-16" id="journeys">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {experiences.map((exp) => (
                <article key={exp.id} className="group">
                  <div className="relative aspect-[4/3] overflow-hidden mb-6 bg-[#1a1a1a]/5">
                    {exp.heroImage ? (
                      <Image
                        src={exp.heroImage}
                        alt={exp.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-[#1a1a1a]/10 text-6xl font-serif">{exp.title[0]}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-baseline gap-4">
                      <h3 className="font-serif text-xl">{exp.title}</h3>
                      <span className="text-xs tracking-[0.15em] text-[#1a1a1a]/30">{exp.duration} DAYS</span>
                    </div>
                    <p className="text-sm text-[#1a1a1a]/50 italic">{exp.tagline}</p>
                    <p className="text-[#1a1a1a]/70 text-sm leading-relaxed">{exp.description}</p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-[#1a1a1a]/40">{exp.cities}</span>
                      <span className="text-sm">From €{exp.price?.toLocaleString()}</span>
                    </div>
                    {exp.highlights && exp.highlights.length > 0 && (
                      <div className="pt-3 border-t border-[#1a1a1a]/5">
                        <ul className="space-y-1">
                          {exp.highlights.map((h, i) => (
                            <li key={i} className="text-xs text-[#1a1a1a]/50 flex items-start gap-2">
                              <span className="text-[#1a1a1a]/20 mt-0.5">→</span>
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {exp.accessibilityNotes && exp.accessibilityNotes.length > 0 && (
                      <div className="pt-2">
                        <ul className="space-y-1">
                          {exp.accessibilityNotes.map((note, i) => (
                            <li key={i} className="text-xs text-[#1a1a1a]/40 italic flex items-start gap-2">
                              <span className="text-[#1a1a1a]/15 mt-0.5">♿</span>
                              {note}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founder's Note */}
      <section className="py-16 md:py-24 bg-[#F5F0E8]">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs tracking-[0.3em] uppercase text-[#1a1a1a]/40 mb-6">
              From the founder
            </p>
            <h2 className="font-serif text-3xl mb-8 italic">{settings.founderNoteTitle}</h2>
            <div className="text-[#1a1a1a]/70 leading-relaxed space-y-4">
              {settings.founderNoteBody.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-[#1a1a1a]/40 mb-4">
              Your Team
            </p>
            <h2 className="font-serif text-3xl italic">The people who'll take care of you</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            {team.map((member) => (
              <div key={member.id} className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-[#1a1a1a]/5 flex items-center justify-center overflow-hidden">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={128}
                      height={128}
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-3xl text-[#1a1a1a]/20 font-serif">{member.name[0]}</span>
                  )}
                </div>
                <h3 className="font-serif text-xl mb-1">{member.name}</h3>
                <p className="text-xs tracking-[0.15em] uppercase text-[#1a1a1a]/40 mb-4">{member.role}</p>
                <p className="text-sm text-[#1a1a1a]/50 italic">&ldquo;{member.quote}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-[#1a1a1a] text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-foreground/40 mb-4">
              Getting Started
            </p>
            <h2 className="text-3xl md:text-4xl font-serif mb-6">
              Simple. No pressure.
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-5xl font-serif text-white/10 mb-4">1</div>
              <h3 className="text-lg mb-2">We talk</h3>
              <p className="text-foreground/50 text-sm">
                WhatsApp, email, or phone. Tell us about you, who you&apos;re travelling with, what matters.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-serif text-white/10 mb-4">2</div>
              <h3 className="text-lg mb-2">We design</h3>
              <p className="text-foreground/50 text-sm">
                A journey shaped around your pace, your interests, your needs. Not a template.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-serif text-white/10 mb-4">3</div>
              <h3 className="text-lg mb-2">You decide</h3>
              <p className="text-foreground/50 text-sm">
                No deposit until you&apos;re ready. Take your time. Ask every question.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-serif text-white/10 mb-4">4</div>
              <h3 className="text-lg mb-2">We&apos;re there</h3>
              <p className="text-foreground/50 text-sm">
                From airport to airport, you&apos;re never alone. We handle everything.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Requirements */}
      <section className="py-16 bg-[#F5F0E8]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="font-serif text-xl mb-4">What we ask of you</h3>
                <ul className="space-y-3 text-[#1a1a1a]/60 text-sm">
                  {settings.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-[#1a1a1a]/30">→</span>
                      <span><strong className="text-[#1a1a1a]/80">{req.title}</strong> — {req.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-serif text-xl mb-4">What we promise you</h3>
                <ul className="space-y-3 text-[#1a1a1a]/60 text-sm">
                  {settings.promises.map((promise, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-[#1a1a1a]/30">→</span>
                      <span><strong className="text-[#1a1a1a]/80">{promise.title}</strong> — {promise.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-[#1a1a1a]" id="contact">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-foreground/40 mb-4">
              Ready when you are
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif italic text-white mb-6">
              Let&apos;s talk about your trip.
            </h2>
            <p className="text-foreground/50 mb-10 leading-relaxed">
              No forms. No automated responses. Just a conversation with someone who can actually help you.
            </p>
            <a
              href={settings.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-white text-[#1a1a1a] px-10 py-4 text-xs tracking-[0.15em] uppercase hover:bg-white/90 transition-colors"
            >
              Begin the Conversation
            </a>
            <p className="mt-8 text-sm text-foreground/30">
              Or email <a href={`mailto:${settings.contactEmail}`} className="underline hover:text-foreground/50">{settings.contactEmail}</a> if you prefer
            </p>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-8 bg-[#1a1a1a] border-t border-foreground/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <Link href="/" className="font-serif text-sm tracking-[0.12em] text-foreground/60 hover:text-foreground transition-colors">
                S L O W &nbsp; M O R O C C O
              </Link>
              <span className="text-white/20">|</span>
              <span className="text-sm text-foreground/40">Marrakech</span>
            </div>
            
            <div className="flex items-center gap-6">
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}`}
                className="flex items-center gap-2 text-sm text-foreground/50 hover:text-foreground transition-colors"
              >
                <Phone className="w-4 h-4" />
                {formatPhoneNumber(settings.whatsappNumber)}
              </a>
              <a
                href={`mailto:${settings.contactEmail}`}
                className="flex items-center gap-2 text-sm text-foreground/50 hover:text-foreground transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email
              </a>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-foreground/30">
              © {new Date().getFullYear()} Slow Morocco. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-foreground/30">
              <Link href="/privacy" className="hover:text-foreground/50 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground/50 transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button - Mobile Only */}
      <a
        href={settings.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:bg-[#20bd5a] transition-colors md:hidden"
        aria-label="Chat on WhatsApp about accessible Morocco tours"
      >
        <MessageCircle className="w-6 h-6 text-white" aria-hidden="true" />
      </a>
    </main>
  );
}
