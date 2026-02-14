import { createClient } from "@supabase/supabase-js";

// Nexus Supabase — shared across all brands
const nexusUrl = process.env.NEXUS_SUPABASE_URL!;
const nexusKey = process.env.NEXUS_SUPABASE_ANON_KEY!;

const nexus = createClient(nexusUrl, nexusKey);

const SITE_ID = process.env.SITE_ID || "slow-morocco";

const BRAND_NAMES: Record<string, string> = {
  "slow-morocco": "Slow Morocco",
  "slow-namibia": "Slow Namibia",
  "slow-turkiye": "Slow Türkiye",
  "slow-tunisia": "Slow Tunisia",
  "slow-mauritius": "Slow Mauritius",
  "riad-di-siena": "Riad di Siena",
  "dancing-with-lions": "Dancing with Lions",
  "slow-world": "Slow World",
  "architecture-morocco": "Architecture of Morocco",
};

function generateUnsubscribeToken(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// ============================================
// NEWSLETTER
// ============================================

export async function subscribeToNewsletter(
  email: string,
  brand?: string
): Promise<{ success: boolean; message: string; isResubscribe?: boolean }> {
  const brandName = brand || BRAND_NAMES[SITE_ID] || SITE_ID;

  try {
    // Check if already subscribed
    const { data: existing } = await nexus
      .from("newsletter_subscribers")
      .select("*")
      .eq("email", email.toLowerCase())
      .eq("brand", brandName)
      .maybeSingle();

    if (existing) {
      if (existing.status === "active") {
        return { success: true, message: "You're already subscribed." };
      }

      // Reactivate
      await nexus
        .from("newsletter_subscribers")
        .update({ status: "active", updated_at: new Date().toISOString() })
        .eq("id", existing.id);

      return {
        success: true,
        message: "Welcome back.",
        isResubscribe: true,
      };
    }

    // New subscription
    const token = generateUnsubscribeToken();
    const { error } = await nexus.from("newsletter_subscribers").insert({
      email: email.toLowerCase(),
      brand: brandName,
      status: "active",
      unsubscribe_token: token,
    });

    if (error) throw error;

    return { success: true, message: "You're in." };
  } catch (error) {
    console.error("[Newsletter] Error subscribing:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function unsubscribeFromNewsletter(
  token: string
): Promise<{ success: boolean; message: string }> {
  try {
    const { data: existing } = await nexus
      .from("newsletter_subscribers")
      .select("*")
      .eq("unsubscribe_token", token)
      .maybeSingle();

    if (!existing) {
      return { success: false, message: "Invalid or expired link." };
    }

    if (existing.status === "unsubscribed") {
      return { success: true, message: "You've already been removed." };
    }

    const { error } = await nexus
      .from("newsletter_subscribers")
      .update({
        status: "unsubscribed",
        unsubscribed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (error) throw error;

    return { success: true, message: "You've been removed." };
  } catch (error) {
    console.error("[Newsletter] Error unsubscribing:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

// ============================================
// NEXUS SHARED DATA (legal, site config, etc.)
// ============================================

export interface NexusSite {
  site_id: string;
  site_name: string;
  site_url: string;
  legal_entity: string;
  contact_email: string;
  contact_phone: string | null;
  whatsapp: string | null;
  jurisdiction_country: string;
  jurisdiction_city: string;
  address_line1: string;
  address_line2: string;
  site_type: string;
  parent_brand: string | null;
}

export interface NexusLegalPage {
  page_id: string;
  page_title: string;
  section_order: number;
  section_title: string;
  section_content: string;
}

export async function getNexusSite(): Promise<NexusSite | null> {
  const { data, error } = await nexus
    .from("nexus_sites")
    .select("*")
    .eq("site_id", SITE_ID)
    .single();
  if (error) {
    console.error("[Nexus] Site error:", error.message);
    return null;
  }
  return data as NexusSite;
}

export async function getNexusLegalPages(): Promise<NexusLegalPage[]> {
  const { data, error } = await nexus
    .from("nexus_legal_pages")
    .select("*")
    .order("page_id")
    .order("section_order", { ascending: true });
  if (error) {
    console.error("[Nexus] Legal error:", error.message);
    return [];
  }
  return data as NexusLegalPage[];
}

export async function getNexusLegalPage(
  pageId: string
): Promise<NexusLegalPage[]> {
  const { data, error } = await nexus
    .from("nexus_legal_pages")
    .select("*")
    .eq("page_id", pageId)
    .order("section_order", { ascending: true });
  if (error) {
    console.error("[Nexus] Legal page error:", error.message);
    return [];
  }
  return data as NexusLegalPage[];
}

export function resolveVariables(text: string, site: NexusSite): string {
  return text
    .replace(/\{\{site_name\}\}/g, site.site_name)
    .replace(/\{\{site_url\}\}/g, site.site_url)
    .replace(/\{\{legal_entity\}\}/g, site.legal_entity)
    .replace(/\{\{contact_email\}\}/g, site.contact_email || "")
    .replace(/\{\{contact_phone\}\}/g, site.contact_phone || "")
    .replace(/\{\{jurisdiction_country\}\}/g, site.jurisdiction_country || "")
    .replace(/\{\{jurisdiction_city\}\}/g, site.jurisdiction_city || "")
    .replace(/\{\{address_line1\}\}/g, site.address_line1 || "")
    .replace(/\{\{address_line2\}\}/g, site.address_line2 || "");
}

export async function getNexusSetting(
  key: string
): Promise<string | null> {
  const { data } = await nexus
    .from("site_settings")
    .select("value")
    .eq("site_id", SITE_ID)
    .eq("key", key)
    .maybeSingle();

  return data?.value || null;
}

export { nexus };
