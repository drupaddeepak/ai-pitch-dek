import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { filmData, theme } = await req.json();

        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
    Create a professional pitch deck for producers with these slides:
    
    Film: ${filmData.title}
    Genre: ${filmData.genre}
    Synopsis: ${filmData.synopsis}
    3-Act Structure: ${JSON.stringify(filmData.storySummary)}
    Characters: ${JSON.stringify(filmData.characters)}
    Theme: ${theme.mood}
    Core Themes: ${filmData.themes}
    
    Generate content for the following slides matches standard industry format.
    Return strictly as a JSON object with this structure:
    {
      "titleSlide": { "title": "Title", "tagline": "Powerful Tagline" },
      "loglineSlide": { "logline": "Logline content" },
      "storySummarySlide": { 
          "act1": "Act 1 summary (Setup)", 
          "act2": "Act 2 summary (Conflict)", 
          "act3": "Act 3 summary (Resolution)" 
      },
      "characterSlides": [
        { "name": "Char Name", "role": "Role", "description": "Description" }
      ],
      "themesSlide": { "title": "Themes & Message", "content": "Description of underlying themes" },
      "visualStyleSlide": { "title": "Visual Style", "content": "Textual description of look/feel" },
      "targetAudienceSlide": { "title": "Target Audience", "content": "Demographics and psychographics" },
      "comparablesSlide": { "title": "Comparables", "content": "Similar successful projects" },
      "budgetSlide": { "title": "Estimated Budget", "content": "Estimated range based on scope (Low/Mid/High) with reasoning" },
      "whyWorkSlide": { "title": "Why This Film Will Work", "content": "Compelling argument for potential success" }
    }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonString = text.replace(/```json\n|\n```/g, "").trim();
        const data = JSON.parse(jsonString);

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error generating slides:", error);
        return NextResponse.json(
            { error: "Failed to generate slides" },
            { status: 500 }
        );
    }
}
