import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
    Analyze this film/web series document and extract the following details.
    Return strictly as a JSON object with this structure:
    Return strictly as a JSON object with this structure:
    {
      "title": "Film Title",
      "logline": "One sentence pitch",
      "genre": "Genre",
      "synopsis": "Full synopsis",
      "storySummary": {
        "act1": "Setup and Inciting Incident",
        "act2": "Rising Action and Midpoint",
        "act3": "Climax and Resolution"
      },
      "characters": [
        { "name": "Name", "role": "Role", "description": "Brief description" }
      ],
      "tone": ["keyword1", "keyword2"],
      "targetAudience": "Target Audience description",
      "themes": "Core themes and underlying message"
    }
    `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: buffer.toString("base64"),
                    mimeType: file.type,
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();
        console.log("Raw Gemini response:", text); // Debug log

        // Robust JSON extraction
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        if (start === -1 || end === -1) {
            throw new Error("No JSON object found in response");
        }
        const jsonString = text.substring(start, end + 1);

        let data;
        try {
            data = JSON.parse(jsonString);
        } catch (jsonError) {
            console.error("JSON Parsing Error:", jsonError);
            console.error("Attempted to parse:", jsonString);
            throw new Error("Failed to parse AI response as JSON");
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error analyzing document:", error);
        if (error instanceof Error) {
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
        }
        return NextResponse.json(
            {
                error: "Failed to analyze document",
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}
