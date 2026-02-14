import { Metadata } from "next";
import LegalPageContent from "@/components/LegalPageContent";

export const metadata: Metadata = {
  title: "Privacy Policy | Slow Morocco",
  description: "Privacy Policy for Slow Morocco travel services.",
  alternates: {
    canonical: "https://www.slowmorocco.com/privacy",
  },
};

export default function PrivacyPage() {
  return <LegalPageContent pageId="privacy" fallbackTitle="Privacy Policy" />;
}
