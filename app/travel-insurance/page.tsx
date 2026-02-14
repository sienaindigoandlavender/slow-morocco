import { Metadata } from "next";
import LegalPageContent from "@/components/LegalPageContent";

export const metadata: Metadata = {
  title: "Travel Insurance | Slow Morocco",
  description: "Travel insurance information for Slow Morocco guests.",
  alternates: {
    canonical: "https://www.slowmorocco.com/travel-insurance",
  },
};

export default function TravelInsurancePage() {
  return (
    <LegalPageContent
      pageId="travel-insurance"
      fallbackTitle="Travel Insurance"
    />
  );
}
