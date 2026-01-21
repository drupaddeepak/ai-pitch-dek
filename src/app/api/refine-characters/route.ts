import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { extractedData, userEdits } = await req.json();

        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
    Original characters: ${JSON.stringify(extractedData.characters)}
    User corrections/notes: ${JSON.stringify(userEdits)}
    
    Update the character list based on the user's corrections.
    Enhance the descriptions to be pitch-ready (compelling, 2-3 sentences).
    Return strictly as a JSON object with this structure:
    {
      "characters": [
        { "name": "Name", "role": "Role", "description": "Compelling description" }
      ]
    }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonString = text.replace(/```json\n|\n```/g, "").trim();
        const data = JSON.parse(jsonString);

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error refining characters:", error);
        return NextResponse.json(
            { error: "Failed to refine characters" },
            { status: 500 }
        );
    }
}
