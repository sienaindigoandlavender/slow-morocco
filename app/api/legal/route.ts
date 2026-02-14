import { NextResponse } from "next/server";
import {
  getNexusLegalPage,
  getNexusSite,
  resolveVariables,
} from "@/lib/nexus";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageId = searchParams.get("page");

  if (!pageId) {
    return NextResponse.json(
      { error: "Missing page parameter" },
      { status: 400 }
    );
  }

  try {
    const [sections, site] = await Promise.all([
      getNexusLegalPage(pageId),
      getNexusSite(),
    ]);

    if (sections.length === 0) {
      return NextResponse.json(
        { error: "Page not found" },
        { status: 404 }
      );
    }

    const resolved = sections.map((s) => ({
      ...s,
      section_content: site
        ? resolveVariables(s.section_content, site)
        : s.section_content,
    }));

    return NextResponse.json({
      page_title: resolved[0].page_title,
      sections: resolved,
    });
  } catch (error) {
    console.error("[Legal API] Error:", error);
    return NextResponse.json(
      { error: "Failed to load legal content" },
      { status: 500 }
    );
  }
}
