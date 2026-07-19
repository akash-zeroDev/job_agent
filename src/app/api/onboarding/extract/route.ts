import { NextRequest, NextResponse } from "next/server";
import { genai } from "@/lib/gemini";
import prisma from "@/lib/prisma";
import { RESUME_EXTRACTION_PROMPT } from "@/utils/prompts";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string || "mock-user-id"; // In real app, from auth session

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to base64 for Gemini (Gemini 1.5 supports document types)
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Data = buffer.toString("base64");

    const result = await genai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: RESUME_EXTRACTION_PROMPT },
            {
              inlineData: {
                data: base64Data,
                mimeType: file.type || "application/pdf"
              }
            }
          ]
        }
      ]
    });

    const responseText = result.text();
    let extractedJson = {};
    try {
      // Find JSON block if wrapped in markdown
      const jsonMatch = responseText?.match(/```(?:json)?\n?([\s\S]*?)```/);
      const jsonString = jsonMatch ? jsonMatch[1] : responseText;
      extractedJson = JSON.parse(jsonString || "{}");
    } catch (e) {
      console.error("Failed to parse Gemini response as JSON", e);
      return NextResponse.json({ error: "AI Parsing failed" }, { status: 500 });
    }

    // Ensure User exists (Mocking auth for this assignment)
    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: "user@example.com",
      }
    });

    // Save to MasterProfile (un-normalized JSON)
    const masterProfile = await prisma.masterProfile.upsert({
      where: { userId: user.id },
      update: {
        extractedJson,
        lastSynced: new Date()
      },
      create: {
        userId: user.id,
        extractedJson
      }
    });

    // Trigger background worker via fetch or pub/sub (Mocked via asynchronous fetch here)
    // In production, we'd use a real job queue like Inngest, Trigger.dev, or Supabase Edge Functions.
    fetch(new URL('/api/workers/embed', req.url).toString(), {
      method: "POST",
      body: JSON.stringify({ masterProfileId: masterProfile.id }),
      headers: { "Content-Type": "application/json" }
    }).catch(console.error); // Do not await, fire and forget

    return NextResponse.json({ success: true, profileId: masterProfile.id });

  } catch (error: any) {
    console.error("Extraction error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
