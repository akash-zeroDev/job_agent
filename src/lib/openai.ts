import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  console.warn("OPENAI_API_KEY is missing from environment variables.");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    encoding_format: "float",
  });
  return response.data[0].embedding;
}
