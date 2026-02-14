import { Metadata } from "next";
import LegalPageContent from "@/components/LegalPageContent";

export const metadata: Metadata = {
  title: "Terms of Service | Slow Morocco",
  description: "Terms of Service for Slow Morocco travel services.",
  alternates: {
    canonical: "https://www.slowmorocco.com/terms",
  },
};

export default function TermsPage() {
  return <LegalPageContent pageId="terms" fallbackTitle="Terms of Service" />;
}
