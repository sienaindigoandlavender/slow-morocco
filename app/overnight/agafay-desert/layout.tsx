import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agafay Desert Overnight | Stone Desert Camp Near Marrakech | Slow Morocco",
  description:
    "One night in Morocco's stone desert. Sunset camel ride, dinner under the stars, silence you can feel. Private luxury camp just 45 minutes from Marrakech.",
  openGraph: {
    title: "Agafay Desert Overnight | Slow Morocco",
    description:
      "One night in the hammada—the stone desert. Sunset camel ride, dinner under the sky, luxury camp 45 minutes from Marrakech.",
    url: "https://www.slowmorocco.com/overnight/agafay-desert",
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/drstfu5yr/image/upload/v1769611923/agafay-desert_sp7d6n.jpg",
        width: 1200,
        height: 630,
        alt: "Agafay Desert Camp at sunset near Marrakech",
      },
    ],
  },
  alternates: {
    canonical: "https://www.slowmorocco.com/overnight/agafay-desert",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AgafayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
