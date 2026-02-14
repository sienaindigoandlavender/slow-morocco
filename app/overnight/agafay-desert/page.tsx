import Link from "next/link";
import { ArrowLeft, Clock, MapPin, Moon } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import AgafayRouteMap from "@/components/AgafayRouteMap";
import AgafayContent from "./AgafayContent";

export const revalidate = 3600;

export default function AgafayOvernightPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Banner from Sheet */}
      <PageBanner
        slug="overnight/agafay-desert"
        fallback={{
          title: "Agafay Desert Under the Stars",
          subtitle: "One night in the stone desert. Sunset camel ride, dinner under the sky, silence you can feel.",
          label: "Overnight Experience",
        }}
      />

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
          {/* Back Link */}
          <Link
            href="/day-trips"
            className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-foreground/70 hover:text-foreground transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            All Experiences
          </Link>

          {/* Meta */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-foreground/70 mb-10">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>2 Days / 1 Night</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>From Marrakech</span>
            </div>
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4" />
              <span>Desert Camp</span>
            </div>
          </div>

          {/* Intro */}
          <p className="text-lg md:text-xl text-foreground leading-relaxed mb-16 font-display italic">
            One night in the stone desert. Sunset camel ride, dinner under the sky, silence you can feel.
          </p>

          {/* Itinerary */}
          <div className="space-y-12 mb-12">
            {/* Day 1 */}
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">
                Day One
              </p>
              <h2 className="font-serif text-2xl mb-4">Into the Stone Desert</h2>
              <div className="text-foreground space-y-4">
                <p>
                  <strong>2:00 PM</strong> — Pickup from your riad in Marrakech. The drive south takes you past the last palm groves, through villages of red earth, until the landscape opens into something older—the Agafay plateau. This is a hammada, a stone desert. No golden dunes here, just ochre rock and silence stretching to the Atlas.
                </p>
                <p>
                  Arrive at your desert camp as the light softens. Settle into your suite, then join your camel for a sunset ride across the desert floor. Return to camp for dinner: Moroccan salads, tagines, the chef's trio—served under a canopy of stars.
                </p>
              </div>
            </div>

            {/* Day 2 */}
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">
                Day Two
              </p>
              <h2 className="font-serif text-2xl mb-4">Morning Light</h2>
              <div className="text-foreground space-y-4">
                <p>
                  Wake to the silence of the desert. Breakfast on the terrace—fresh bread, honey, eggs, fruit—with the Atlas Mountains catching the morning sun. Take your time. The desert doesn't rush.
                </p>
                <p>
                  <strong>12:00 PM</strong> — Transfer back to Marrakech, arriving early afternoon.
                </p>
              </div>
            </div>
          </div>

          {/* Route Map */}
          <AgafayRouteMap className="mb-16" />

          {/* Accommodation */}
          <div className="bg-sand p-8 mb-12">
            <h3 className="font-serif text-xl mb-2">Desert Stone Camp</h3>
            <p className="text-sm text-foreground/70 mb-4">Suite · Half-Board</p>
            <p className="text-foreground">
              A camp of stone and canvas set into the Agafay plateau. Private suite with double bed, en-suite bathroom, and terrace facing the Atlas. Dinner and breakfast included.
            </p>
            <p className="text-sm text-foreground/70 mt-4 italic">
              We work with select luxury camps in Agafay, subject to availability.
            </p>
          </div>

          {/* What's Included */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-xs tracking-[0.15em] uppercase text-foreground/70 mb-4">
                Included
              </h3>
              <ul className="space-y-2">
                {[
                  "Private transfer from Marrakech",
                  "One night at a luxury desert camp",
                  "Dinner + breakfast (half-board)",
                  "Sunset camel ride with handler",
                  "Private transfer back to Marrakech",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="text-foreground/50 mt-0.5">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs tracking-[0.15em] uppercase text-foreground/70 mb-4">
                Not Included
              </h3>
              <ul className="space-y-2">
                {[
                  "Drinks at camp",
                  "Lunch",
                  "Tips",
                  "Additional activities",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-foreground/70">
                    <span className="mt-0.5">–</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Client component: Pricing + Booking Modal */}
          <AgafayContent />

          <p className="text-sm text-foreground/70 mt-4 text-center">
            or <Link href="/contact" className="underline hover:text-foreground">send us a note</Link>
          </p>
        </div>
      </section>

      {/* Other Experiences */}
      <section className="py-16 md:py-20 border-t border-border">
        <div className="container mx-auto px-6 lg:px-16">
          <h2 className="font-serif text-2xl text-center mb-12">
            Explore More
          </h2>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/journeys"
              className="inline-block border border-foreground px-8 py-3 text-xs tracking-[0.15em] uppercase hover:bg-foreground hover:text-background transition-colors"
            >
              View All Journeys
            </Link>
            <Link
              href="/day-trips"
              className="inline-block border border-foreground/30 px-8 py-3 text-xs tracking-[0.15em] uppercase text-foreground/70 hover:border-foreground hover:text-foreground transition-colors"
            >
              Day Tours
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
