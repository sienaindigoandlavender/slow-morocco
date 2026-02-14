import { Metadata } from "next";
import LegalPageContent from "@/components/LegalPageContent";

export const metadata: Metadata = {
  title: "Health & Safety | Slow Morocco",
  description: "Health and safety information for Slow Morocco travel services.",
  alternates: {
    canonical: "https://www.slowmorocco.com/health-safety",
  },
};

export default function HealthSafetyPage() {
  return (
    <LegalPageContent
      pageId="health-safety"
      fallbackTitle="Health & Safety"
    />
  );
}
