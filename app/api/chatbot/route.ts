import { NextResponse } from "next/server";
import { getChatbotTraining, type ChatbotTraining } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface ChatRequest {
  message: string;
  history?: { role: string; content: string }[];
}

// Simple keyword matching to find relevant answers
function findBestMatch(query: string, training: ChatbotTraining[]): ChatbotTraining | null {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/);

  let bestMatch: ChatbotTraining | null = null;
  let bestScore = 0;

  for (const item of training) {
    let score = 0;

    if (item.keywords) {
      const keywords = item.keywords.toLowerCase().split(",").map((k) => k.trim());
      for (const keyword of keywords) {
        if (queryLower.includes(keyword)) score += 3;
      }
    }

    if (item.question) {
      const questionWords = item.question.toLowerCase().split(/\s+/);
      for (const word of queryWords) {
        if (word.length > 2 && questionWords.some((qw) => qw.includes(word) || word.includes(qw))) {
          score += 1;
        }
      }
    }

    if (item.category && queryLower.includes(item.category.toLowerCase())) score += 2;

    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }

  return bestScore >= 2 ? bestMatch : null;
}

// Default training data if chatbot_training table is empty
function getDefaultTraining(): ChatbotTraining[] {
  return [
    { id: 0, category: "greeting", question: "Hello", answer: "Hello. Ask me anything about Morocco or our journeys.", keywords: "hello,hi,hey,bonjour,salaam", sort_order: 1 },
    { id: 0, category: "fallback", question: "I don't understand", answer: "I don't have an answer for that. Email us at hello@slowmorocco.com or use the Plan Your Trip form.", keywords: "", sort_order: 999 },
    { id: 0, category: "journeys", question: "What journeys do you offer?", answer: "Private journeys from 3 to 14 days. Sahara, Imperial Cities, coast, mountains - depends what you're after. Everything's customizable.", keywords: "journey,journeys,tour,tours,itinerary,trip,trips,routes,options", sort_order: 10 },
    { id: 0, category: "prices", question: "How much do your journeys cost?", answer: "Depends on duration and accommodation level. Roughly: 3 days from €1,200, 12 days around €4,500 - for two guests. Includes transport, accommodation, guides, most meals. Use Plan Your Trip for a real quote.", keywords: "price,cost,how much,expensive,budget,euro,money,rate", sort_order: 11 },
    { id: 0, category: "included", question: "What's included?", answer: "Private 4x4 with driver. Handpicked riads and camps. Local guides. Breakfasts, most dinners. Not included: flights, insurance, personal expenses.", keywords: "include,included,what's in,cover,meals,hotel,transport,guide", sort_order: 12 },
    { id: 0, category: "booking", question: "How do I book?", answer: "Fill out the Plan Your Trip form. We send a proposal within 48 hours. 30% deposit holds your dates, balance due 60 days before.", keywords: "book,booking,reserve,reservation,how to,start,begin,deposit,payment", sort_order: 13 },
    { id: 0, category: "contact", question: "How can I contact you?", answer: "Plan Your Trip form or hello@slowmorocco.com. WhatsApp: +212 6 18 07 04 50.", keywords: "contact,email,phone,whatsapp,reach,talk,call", sort_order: 18 },
  ];
}

export async function GET() {
  try {
    const training = await getChatbotTraining();
    return NextResponse.json({
      training: training.length > 0 ? training : getDefaultTraining(),
    });
  } catch (error) {
    console.error("Error fetching chatbot training:", error);
    return NextResponse.json({ training: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { message, history }: ChatRequest = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    let training = await getChatbotTraining();
    if (training.length === 0) training = getDefaultTraining();

    const greetingItem = training.find((t) => t.category?.toLowerCase() === "greeting");
    const greetingWords = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "salaam", "bonjour"];
    const isGreeting = greetingWords.some((g) => message.toLowerCase().trim().startsWith(g));

    if (isGreeting && greetingItem) {
      return NextResponse.json({ response: greetingItem.answer, category: "greeting" });
    }

    const match = findBestMatch(
      message,
      training.filter((t) => t.category?.toLowerCase() !== "system")
    );

    if (match) {
      return NextResponse.json({ response: match.answer, category: match.category, matched_question: match.question });
    }

    const fallbackItem = training.find((t) => t.category?.toLowerCase() === "fallback");
    const fallbackResponse =
      fallbackItem?.answer ||
      "I'd love to help you plan your Morocco journey. For specific questions about itineraries, pricing, or bookings, please reach out to us at hello@slowmorocco.com or use our Plan Your Trip form. What else would you like to know about traveling with us?";

    return NextResponse.json({ response: fallbackResponse, category: "fallback" });
  } catch (error) {
    console.error("Chatbot error:", error);
    return NextResponse.json(
      { response: "I apologize, but I'm having trouble right now. Please try again or email us at hello@slowmorocco.com", error: true },
      { status: 500 }
    );
  }
}
