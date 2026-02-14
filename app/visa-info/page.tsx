import { Metadata } from "next";
import LegalPageContent from "@/components/LegalPageContent";

export const metadata: Metadata = {
  title: "Visa Information | Slow Morocco",
  description: "Visa and entry requirements for Morocco.",
  alternates: {
    canonical: "https://www.slowmorocco.com/visa-info",
  },
};

export default function VisaInfoPage() {
  return (
    <LegalPageContent
      pageId="visa-info"
      fallbackTitle="Visa Information"
    />
  );
}
