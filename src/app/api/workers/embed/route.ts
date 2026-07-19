import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateEmbedding } from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const { masterProfileId } = await req.json();

    if (!masterProfileId) {
      return NextResponse.json({ error: "Missing masterProfileId" }, { status: 400 });
    }

    const masterProfile = await prisma.masterProfile.findUnique({
      where: { id: masterProfileId },
    });

    if (!masterProfile || !masterProfile.extractedJson) {
      return NextResponse.json({ error: "Profile not found or empty" }, { status: 404 });
    }

    const data: any = masterProfile.extractedJson;

    // Delete existing chunks if any to avoid duplicates
    await prisma.profileChunk.deleteMany({
      where: { masterProfileId }
    });

    const chunksToEmbed = [];

    // Chunking logic
    if (data.projects && Array.isArray(data.projects)) {
      for (const p of data.projects) {
        const text = `Project: ${p.title}\nDescription: ${p.description}\nTech Stack: ${(p.techStack || []).join(", ")}`;
        chunksToEmbed.push({ type: "project", content: text, metadata: p });
      }
    }

    if (data.experience && Array.isArray(data.experience)) {
      for (const e of data.experience) {
        const text = `Experience: ${e.designation} at ${e.company}\nImpact: ${e.impact}\nDetails: ${(e.bulletPoints || []).join(" ")}`;
        chunksToEmbed.push({ type: "experience", content: text, metadata: e });
      }
    }

    if (data.education && Array.isArray(data.education)) {
      for (const edu of data.education) {
        const text = `Education: ${edu.degree} in ${edu.major} from ${edu.university}`;
        chunksToEmbed.push({ type: "education", content: text, metadata: edu });
      }
    }

    if (data.skills) {
      const allSkills = Object.values(data.skills).flat().filter(Boolean);
      if (allSkills.length > 0) {
        const text = `Skills: ${allSkills.join(", ")}`;
        chunksToEmbed.push({ type: "skills", content: text, metadata: data.skills });
      }
    }

    // Process and insert chunks
    for (const chunk of chunksToEmbed) {
      const embeddingVector = await generateEmbedding(chunk.content);
      
      // Prisma raw query for inserting pgvector
      // We format the array to Postgres vector format: '[0.1, 0.2, ...]'
      const vectorString = \`[\${embeddingVector.join(",")}]\`;

      await prisma.$executeRaw\`
        INSERT INTO "ProfileChunk" (id, "masterProfileId", "chunkType", content, metadata, "createdAt", embedding)
        VALUES (gen_random_uuid(), \${masterProfileId}, \${chunk.type}, \${chunk.content}, \${chunk.metadata}::jsonb, NOW(), \${vectorString}::vector)
      \`;
    }

    return NextResponse.json({ success: true, chunksProcessed: chunksToEmbed.length });
  } catch (error: any) {
    console.error("Embedding Worker Error:", error);
    return NextResponse.json({ error: "Worker failed" }, { status: 500 });
  }
}
