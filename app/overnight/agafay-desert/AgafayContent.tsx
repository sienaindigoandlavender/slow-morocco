"use client";

import React, { useState, useEffect } from "react";
import OvernightBookingModal from "@/components/OvernightBookingModal";

// Pricing breakdown in MAD
const pricingMAD = {
  transfers: { label: "Private transfers (550 × 2 ways)", amount: 1100 },
  room: { label: "Suite for 2, half-board", amount: 2650 },
  camel: { label: "Sunset camel ride (300 × 2)", amount: 600 },
};
const totalMAD = pricingMAD.transfers.amount + pricingMAD.room.amount + pricingMAD.camel.amount;
const COORDINATION_FEE = 50;

export default function AgafayContent() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [eurRate, setEurRate] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://api.exchangerate-api.com/v4/latest/MAD")
      .then((res) => res.json())
      .then((data) => {
        if (data.rates?.EUR) {
          setEurRate(data.rates.EUR);
        }
      })
      .catch(() => {
        setEurRate(0.091);
      });
  }, []);

  const toEUR = (mad: number) => {
    if (!eurRate) return null;
    return Math.round(mad * eurRate);
  };

  const baseEUR = toEUR(totalMAD);
  const totalEUR = baseEUR ? baseEUR + COORDINATION_FEE : null;

  const pricingEUR = eurRate && baseEUR ? {
    transfers: { label: "Private transfers", amount: toEUR(pricingMAD.transfers.amount) || 0 },
    room: { label: "Suite for 2, half-board", amount: toEUR(pricingMAD.room.amount) || 0 },
    camel: { label: "Sunset camel ride (× 2)", amount: toEUR(pricingMAD.camel.amount) || 0 },
    coordination: { label: "Concierge service", amount: COORDINATION_FEE },
  } : null;

  return (
    <>
      {/* Pricing */}
      <div className="bg-[#d4cdc4] p-8 md:p-10 mb-12 text-center">
        <p className="text-xs tracking-[0.2em] uppercase text-foreground/60 mb-4">
          Private Experience for Two
        </p>
        {totalEUR ? (
          <>
            <p className="text-4xl md:text-5xl font-serif text-foreground mb-2">€{totalEUR}</p>
            <p className="text-sm text-foreground/60">All-inclusive · Transfers · Accommodation · Camel ride</p>
          </>
        ) : (
          <>
            <p className="text-4xl md:text-5xl font-serif text-foreground mb-2">~€446</p>
            <p className="text-sm text-foreground/60">All-inclusive · Transfers · Accommodation · Camel ride</p>
          </>
        )}
      </div>

      {/* Booking CTA */}
      <div className="text-center">
        <button
          onClick={() => setIsBookingOpen(true)}
          className="inline-block bg-foreground text-background px-12 py-4 text-xs tracking-[0.2em] uppercase hover:bg-foreground/90 transition-colors"
        >
          Reserve This Experience
        </button>
      </div>

      {/* Booking Modal */}
      {pricingEUR && totalEUR && (
        <OvernightBookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          experienceTitle="Agafay Desert Overnight"
          pricingEUR={pricingEUR}
          totalEUR={totalEUR}
        />
      )}
    </>
  );
}
