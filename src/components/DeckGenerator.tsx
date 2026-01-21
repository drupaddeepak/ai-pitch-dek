"use client";

import { useState } from "react";
import PptxGenJS from "pptxgenjs";
import { FilmData, Theme, SlideContent } from "../types";
import { Download, Loader2, Sparkles, Layout, Palette } from "lucide-react";

interface DeckGeneratorProps {
    filmData: FilmData;
    theme: Theme;
}

export default function DeckGenerator({ filmData, theme }: DeckGeneratorProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const generatePPT = async () => {
        setIsGenerating(true);

        try {
            const response = await fetch("/api/generate-slides", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filmData, theme }),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.details || "Failed to generate slide content");
            }

            const content: SlideContent = await response.json();

            // ---- PPT INIT (CORRECT) ----
            const pptx = new PptxGenJS();
            pptx.author = "AI Pitch Deck Generator";
            pptx.company = "Indie Producer";
            pptx.title = filmData.title;
            pptx.layout = "LAYOUT_16x9";

            // ---- THEME ----
            const primaryColor =
                theme.primaryColors?.[0]?.replace("#", "") || "111111";
            const secondaryColor =
                theme.secondaryColors?.[0]?.replace("#", "") || "666666";
            const accentColor =
                theme.secondaryColors?.[1]?.replace("#", "") || "D4AF37";

            const textColor = "333333";
            const titleFont = "Arial";
            const bodyFont = "Calibri";

            // ---- HELPERS ----
            const addFooter = (slide: any, pageNum: number) => {
                slide.addShape(pptx.ShapeType.line, {
                    x: 0.5,
                    y: 5.2,
                    w: 9,
                    h: 0,
                    line: { color: "E0E0E0", width: 1 },
                });

                slide.addText(filmData.title.toUpperCase(), {
                    x: 0.5,
                    y: 5.3,
                    fontSize: 8,
                    color: "999999",
                    bold: true,
                });

                slide.addText(String(pageNum), {
                    x: 9.2,
                    y: 5.3,
                    fontSize: 8,
                    color: "999999",
                    align: "right",
                });
            };

            const addHeader = (
                slide: any,
                title: string,
                subtitle?: string
            ) => {
                slide.addText(subtitle?.toUpperCase() || "SECTION", {
                    x: 0.5,
                    y: 0.4,
                    fontSize: 10,
                    color: accentColor,
                    bold: true,
                    charSpacing: 3,
                });

                slide.addText(title, {
                    x: 0.5,
                    y: 0.8,
                    fontSize: 24,
                    color: primaryColor,
                    bold: true,
                    fontFace: titleFont,
                });
            };

            // ---- 1. TITLE SLIDE ----
            const slide1 = pptx.addSlide();
            slide1.background = { color: "111111" };

            slide1.addText(content.titleSlide.title.toUpperCase(), {
                x: 0.5,
                y: 1.5,
                w: 9,
                fontSize: 48,
                bold: true,
                color: "FFFFFF",
                align: "center",
                fontFace: titleFont,
            });

            slide1.addShape(pptx.ShapeType.line, {
                x: 3,
                y: 2.8,
                w: 4,
                h: 0,
                line: { color: accentColor, width: 2 },
            });

            slide1.addText(content.loglineSlide.logline, {
                x: 1,
                y: 3.2,
                w: 8,
                fontSize: 20,
                color: "E0E0E0",
                align: "center",
                italic: true,
                fontFace: bodyFont,
            });

            // ---- 2. GENRE & TONE ----
            const slide2 = pptx.addSlide();
            addFooter(slide2, 2);
            addHeader(slide2, "Genre & Tone", "Atmosphere");

            slide2.addText("GENRE", {
                x: 0.5,
                y: 1.8,
                fontSize: 14,
                bold: true,
                color: secondaryColor,
            });

            slide2.addText(filmData.genre, {
                x: 0.5,
                y: 2.1,
                fontSize: 24,
                color: textColor,
            });

            slide2.addText("TONE KEYWORDS", {
                x: 5,
                y: 1.8,
                fontSize: 14,
                bold: true,
                color: secondaryColor,
            });

            filmData.tone.forEach((t, i) => {
                slide2.addShape(pptx.ShapeType.roundRect, {
                    x: 5 + i * 1.5,
                    y: 2.1,
                    w: 1.4,
                    h: 0.5,
                    fill: { color: "F0F0F0" },
                    line: { color: "CCCCCC" },
                });

                slide2.addText(t, {
                    x: 5 + i * 1.5,
                    y: 2.1,
                    w: 1.4,
                    h: 0.5,
                    fontSize: 10,
                    align: "center",
                    color: "555555",
                });
            });

            // ---- 3. STORY SUMMARY ----
            const slide3 = pptx.addSlide();
            addFooter(slide3, 3);
            addHeader(slide3, "Story Summary", "Narrative Arc");

            slide3.addText(
                `${content.storySummarySlide.act1}\n\n${content.storySummarySlide.act2}\n\n${content.storySummarySlide.act3}`,
                {
                    x: 0.5,
                    y: 1.8,
                    w: 9,
                    fontSize: 12,
                    color: textColor,
                }
            );

            // ---- 4. CHARACTERS ----
            const slide4 = pptx.addSlide();
            addFooter(slide4, 4);
            addHeader(slide4, "Key Characters", "Cast");

            content.characterSlides.slice(0, 3).forEach((char, idx) => {
                const y = 1.5 + idx * 1.2;

                slide4.addText(char.name.toUpperCase(), {
                    x: 0.5,
                    y,
                    w: 3,
                    fontSize: 16,
                    bold: true,
                    color: primaryColor,
                });

                slide4.addText(char.role, {
                    x: 0.5,
                    y: y + 0.3,
                    w: 3,
                    fontSize: 11,
                    italic: true,
                    color: secondaryColor,
                });

                slide4.addText(char.description, {
                    x: 3.5,
                    y,
                    w: 6,
                    fontSize: 12,
                    color: textColor,
                });
            });

            // ---- SAVE ----
            await pptx.writeFile({
                fileName: `${filmData.title.replace(/[^a-z0-9]/gi, "_")}_StandardDeck.pptx`,
            });
        } catch (err) {
            console.error(err);
            alert(err instanceof Error ? err.message : "Generation failed");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-10 bg-white rounded-2xl shadow-xl border text-center">
            <div className="mb-8">
                <div className="inline-flex p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6">
                    <Sparkles className="w-10 h-10 text-white" />
                </div>

                <h2 className="text-3xl font-extrabold mb-3">Ready to Generate</h2>

                <div className="flex justify-center gap-6 text-sm text-gray-500 mb-6">
                    <span className="flex items-center gap-1">
                        <Layout className="w-4 h-4" /> Standard 10-Slide Format
                    </span>
                    <span className="flex items-center gap-1">
                        <Palette className="w-4 h-4" /> Cinematic Style
                    </span>
                </div>
            </div>

            <button
                onClick={generatePPT}
                disabled={isGenerating}
                className="w-full max-w-sm mx-auto rounded-xl bg-black p-4 text-white font-bold disabled:opacity-70"
            >
                {isGenerating ? (
                    <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Writing Slides...
                    </span>
                ) : (
                    <span className="flex items-center justify-center gap-2">
                        <Download className="w-6 h-6" />
                        Download Standard Deck
                    </span>
                )}
            </button>
        </div>
    );
}
