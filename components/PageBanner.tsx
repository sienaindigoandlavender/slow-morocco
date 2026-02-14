"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface BannerData {
  page_slug: string;
  hero_image_url: string;
  midjourney?: string;
  title: string;
  subtitle?: string;
  label_text?: string;
}

interface PageBannerProps {
  slug: string;
  fallback?: {
    title: string;
    subtitle?: string;
    label?: string;
    image?: string;
  };
}

export default function PageBanner({ slug, fallback }: PageBannerProps) {
  const [banner, setBanner] = useState<BannerData | null>(null);

  useEffect(() => {
    fetch(`/api/page-banners?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.banner) setBanner(data.banner);
      })
      .catch((err) => {
        console.error("Banner fetch error:", err);
      });
  }, [slug]);

  // Use banner data or fallback — fallback renders immediately in SSR
  const title = banner?.title || fallback?.title || "";
  const subtitle = banner?.subtitle || fallback?.subtitle || "";
  const label = banner?.label_text || fallback?.label || "";
  const image = banner?.hero_image_url || fallback?.image || "";

  return (
    <section className="relative h-[70vh] md:h-[80vh] flex items-end">
      {/* Background Image */}
      {image ? (
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-[#8B7355]" />
      )}

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

      {/* Content — always rendered for SSR/crawlers */}
      <div className="relative z-10 w-full">
        <div className="container mx-auto px-8 md:px-16 lg:px-20 pb-16 md:pb-20">
          <div className="max-w-3xl">
            {/* Label */}
            {label && (
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/60 mb-4">
                {label}
              </p>
            )}

            {/* Title as H1 for SEO */}
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] mb-4">
              {title}
            </h1>

            {/* Subtitle */}
            {subtitle && (
              <p className="text-white/90 text-lg md:text-xl leading-relaxed max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
