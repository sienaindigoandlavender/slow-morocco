import { Metadata } from "next";
import LegalPageContent from "@/components/LegalPageContent";

export const metadata: Metadata = {
  title: "Cancellation Policy | Slow Morocco",
  description: "Cancellation Policy for Slow Morocco travel services.",
  alternates: {
    canonical: "https://www.slowmorocco.com/cancellation-policy",
  },
};

export default function CancellationPolicyPage() {
  return (
    <LegalPageContent
      pageId="cancellation-policy"
      fallbackTitle="Cancellation Policy"
    />
  );
}
