import { NextResponse } from "next/server";
import { getSettingsMap, getFooterLinks, convertDriveUrl } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_ID = process.env.SITE_ID || "slow-morocco";

export async function GET() {
  try {
    // Get settings from Supabase
    const settingsMap = await getSettingsMap();

    const newsletterConfig = {
      show: settingsMap.newsletter_show !== "false",
      backgroundImage: convertDriveUrl(settingsMap.newsletter_background_image || ""),
      title: settingsMap.newsletter_title || "Notes from Morocco",
      description: settingsMap.newsletter_description || "Quiet. Irregular. Real.",
      brandName: settingsMap.site_name || "Slow Morocco",
    };

    // Build contact links from settings
    const contactLinks: any[] = [];
    if (settingsMap.contact_address_line1) {
      contactLinks.push({ order: 1, label: settingsMap.contact_address_line1, href: null, type: "address" });
    }
    if (settingsMap.contact_address_line2) {
      contactLinks.push({ order: 2, label: settingsMap.contact_address_line2, href: null, type: "address" });
    }
    if (settingsMap.contact_email) {
      contactLinks.push({ order: 3, label: settingsMap.contact_email, href: `mailto:${settingsMap.contact_email}`, type: "email" });
    }
    if (settingsMap.social_pinterest) {
      contactLinks.push({ order: 4, label: "Pinterest", href: settingsMap.social_pinterest, type: "social" });
    }
    if (settingsMap.social_instagram) {
      contactLinks.push({ order: 5, label: "Instagram", href: settingsMap.social_instagram, type: "social" });
    }
    if (settingsMap.social_youtube) {
      contactLinks.push({ order: 6, label: "YouTube", href: settingsMap.social_youtube, type: "social" });
    }

    // Get footer links from Supabase
    const footerLinks = await getFooterLinks();

    // Known slugs for auto-linking
    const autoLinks: { [key: string]: string } = {
      "all places": "/places",
      cities: "/places?region=cities",
      mountains: "/places?region=mountains",
      coastal: "/places?region=coastal",
      desert: "/places?region=desert",
      "all stories": "/stories",
      stories: "/stories",
      "all journeys": "/journeys",
      "epic journeys": "/epic",
      "plan your trip": "/plan-your-trip",
      "what's included": "/whats-included",
      "whats included": "/whats-included",
      faq: "/faq",
      about: "/about",
      "about us": "/about",
      contact: "/contact",
      "contact us": "/contact",
      "visa info": "/visa-info",
      "visa information": "/visa-info",
      "health & safety": "/health-safety",
      "health and safety": "/health-safety",
      "travel insurance": "/travel-insurance",
      "cancellation policy": "/cancellation-policy",
    };

    // Group links by column
    const columnMap: { [key: number]: any } = {};

    footerLinks.forEach((link) => {
      const colNum = link.column_number || 1;
      if (!columnMap[colNum]) {
        columnMap[colNum] = {
          number: colNum,
          title: link.column_title || "",
          links: [],
        };
      }

      let href = link.link_href || null;
      const labelLower = (link.link_label || "").toLowerCase().trim();
      if (!href && autoLinks[labelLower]) {
        href = autoLinks[labelLower];
      }

      columnMap[colNum].links.push({
        order: link.link_order || 0,
        label: link.link_label || "",
        href: href,
        type: link.link_type || "link",
      });
    });

    // Sort links within each column
    Object.values(columnMap).forEach((col: any) => {
      col.links.sort((a: any, b: any) => a.order - b.order);

      if (col.title.toLowerCase() === "places") {
        const hasAllPlaces = col.links.some((l: any) => l.label.toLowerCase() === "all places");
        if (!hasAllPlaces) {
          col.links.unshift({ order: 0, label: "All Places", href: "/places", type: "link" });
        }
      }

      if (col.title.toLowerCase().includes("about") || col.title.toLowerCase().includes("morocco")) {
        const hasAllStories = col.links.some(
          (l: any) => l.label.toLowerCase() === "all stories" || l.label.toLowerCase() === "stories"
        );
        if (!hasAllStories) {
          col.links.unshift({ order: 0, label: "All Stories", href: "/stories", type: "link" });
        }
      }
    });

    const columns = Object.values(columnMap).sort((a: any, b: any) => a.number - b.number);

    // Legal pages (hardcoded — shared across brands, rarely change)
    const legal = [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Disclaimer", href: "/disclaimer" },
      { label: "Intellectual Property", href: "/intellectual-property" },
    ];

    const countryName = newsletterConfig.brandName.replace("Slow ", "") || "Us";

    // Contact column (always Column 1)
    const contactColumn = {
      number: 1,
      title: "Contact",
      links: contactLinks.length > 0 ? contactLinks : [{ order: 1, label: "Contact us", href: "/contact", type: "link" }],
    };

    let finalColumns: any[] = [];

    if (columns.length > 0) {
      finalColumns = [contactColumn, ...columns];
    } else {
      finalColumns = [
        contactColumn,
        {
          number: 2,
          title: "Places",
          links: [
            { order: 1, label: "All Places", href: "/places", type: "link" },
            { order: 2, label: "Cities", href: "/places?region=cities", type: "link" },
            { order: 3, label: "Mountains", href: "/places?region=mountains", type: "link" },
            { order: 4, label: "Coastal", href: "/places?region=coastal", type: "link" },
            { order: 5, label: "Desert", href: "/places?region=desert", type: "link" },
          ],
        },
        {
          number: 3,
          title: "Journeys",
          links: [
            { order: 1, label: "All Journeys", href: "/journeys", type: "link" },
            { order: 2, label: "Plan Your Trip", href: "/plan-your-trip", type: "link" },
            { order: 3, label: "What's Included", href: "/whats-included", type: "link" },
            { order: 4, label: "FAQ", href: "/faq", type: "link" },
            { order: 5, label: "About Us", href: "/about", type: "link" },
            { order: 6, label: "Contact Us", href: "/contact", type: "link" },
          ],
        },
        {
          number: 4,
          title: `About ${countryName}`,
          links: [
            { order: 1, label: "All Stories", href: "/stories", type: "link" },
            { order: 2, label: "Visa Info", href: "/visa-info", type: "link" },
            { order: 3, label: "Health & Safety", href: "/health-safety", type: "link" },
            { order: 4, label: "Travel Insurance", href: "/travel-insurance", type: "link" },
            { order: 5, label: "Cancellation Policy", href: "/cancellation-policy", type: "link" },
          ],
        },
      ];
    }

    const footerData = {
      brandId: SITE_ID,
      newsletter: newsletterConfig,
      columns: finalColumns,
      legal,
      copyright: {
        year: new Date().getFullYear(),
        name: newsletterConfig.brandName,
      },
    };

    const response = NextResponse.json({ success: true, data: footerData });
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    return response;
  } catch (error: any) {
    console.error("Footer fetch error:", error);
    return NextResponse.json({
      success: true,
      data: {
        brandId: SITE_ID,
        newsletter: { show: true, backgroundImage: "", title: "Notes from Morocco", description: "Quiet. Irregular. Real.", brandName: "Slow Morocco" },
        columns: [
          { number: 1, title: "Contact", links: [{ order: 1, label: "Contact us", href: "/contact", type: "link" }] },
          { number: 2, title: "Places", links: [{ order: 1, label: "All Places", href: "/places", type: "link" }] },
          { number: 3, title: "Journeys", links: [{ order: 1, label: "All Journeys", href: "/journeys", type: "link" }] },
          { number: 4, title: "About Morocco", links: [{ order: 1, label: "All Stories", href: "/stories", type: "link" }] },
        ],
        legal: [
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Terms of Service", href: "/terms" },
          { label: "Disclaimer", href: "/disclaimer" },
        ],
        copyright: { year: new Date().getFullYear(), name: "Slow Morocco" },
      },
    });
  }
}
