import { Metadata } from "next";
import LegalPageContent from "@/components/LegalPageContent";

export const metadata: Metadata = {
  title: "Disclaimer | Slow Morocco",
  description: "Disclaimer for Slow Morocco travel services.",
  alternates: {
    canonical: "https://www.slowmorocco.com/disclaimer",
  },
};

export default function DisclaimerPage() {
  return <LegalPageContent pageId="disclaimer" fallbackTitle="Disclaimer" />;
}
