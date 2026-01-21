"use client";

import { useState } from "react";
import pptxgen from "pptxgenjs";
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

            // Client-side PPT Generation
            const pptx = new pptxgen();
            pptx.author = "AI Pitch Deck Generator";
            pptx.company = "Indie Producer";
            pptx.title = filmData.title;
            pptx.layout = "LAYOUT_16x9";

            // Colors & Fonts
            const primaryColor = theme.primaryColors[0]?.replace('#', '') || "111111";
            const secondaryColor = theme.secondaryColors[0]?.replace('#', '') || "666666";
            const accentColor = theme.secondaryColors[1]?.replace('#', '') || "D4AF37"; // Gold default
            const bgColor = "FFFFFF";
            const textColor = "333333";
            const titleFont = "Arial";
            const bodyFont = "Calibri";

            // Helper: Add Footer
            const addFooter = (slide: any, pageNum: number) => {
                slide.addShape(pptx.ShapeType.line, { x: 0.5, y: 5.2, w: 9, h: 0, line: { color: "E0E0E0", width: 1 } });
                slide.addText(filmData.title.toUpperCase(), {
                    x: 0.5, y: 5.3, fontSize: 8, color: "999999", bold: true
                });
                slide.addText(`${pageNum}`, {
                    x: 9.2, y: 5.3, fontSize: 8, color: "999999", align: "right"
                });
            };

            // Helper: Add Section Header
            const addHeader = (slide: any, title: string, subtitle?: string) => {
                slide.addText(subtitle?.toUpperCase() || "SECTION", { x: 0.5, y: 0.4, fontSize: 10, color: accentColor, bold: true, charSpacing: 3 });
                slide.addText(title, { x: 0.5, y: 0.8, fontSize: 24, color: primaryColor, bold: true, fontFace: titleFont });
            };


            // --- 1. TITLE & LOGLINE ---
            const slide1 = pptx.addSlide();
            slide1.background = { color: "111111" }; // Cinematic Dark
            // Image placeholder or gradient
            slide1.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: "000000", transparency: 30 } });

            slide1.addText(content.titleSlide.title.toUpperCase(), {
                x: 0.5, y: 1.5, w: 9, fontSize: 48, bold: true, color: "FFFFFF", align: "center", fontFace: titleFont
            });
            slide1.addShape(pptx.ShapeType.line, { x: 3, y: 2.8, w: 4, h: 0, line: { color: accentColor, width: 2 } });

            slide1.addText(content.loglineSlide.logline, {
                x: 1, y: 3.2, w: 8, fontSize: 20, color: "E0E0E0", align: "center", italic: true, fontFace: bodyFont
            });

            // --- 2. GENRE & TONE ---
            const slide2 = pptx.addSlide();
            addFooter(slide2, 2);
            addHeader(slide2, "Genre & Tone", "ATMOSPHERE");

            slide2.addText("GENRE", { x: 0.5, y: 1.8, fontSize: 14, bold: true, color: secondaryColor });
            slide2.addText(filmData.genre, { x: 0.5, y: 2.1, fontSize: 24, color: textColor });

            slide2.addText("TONE KEYWORDS", { x: 5, y: 1.8, fontSize: 14, bold: true, color: secondaryColor });
            // Visual Chips for Tone
            filmData.tone.forEach((t, i) => {
                slide2.addShape(pptx.ShapeType.roundRect, {
                    x: 5 + (i * 1.5), y: 2.1, w: 1.4, h: 0.5, r: 0.2,
                    fill: { color: "F0F0F0" }, line: { color: "CCCCCC" }
                });
                slide2.addText(t, {
                    x: 5 + (i * 1.5), y: 2.1, w: 1.4, h: 0.5,
                    fontSize: 10, align: "center", color: "555555"
                });
            });

            // --- 3. STORY SUMMARY (3 ACTS) ---
            const slide3 = pptx.addSlide();
            addFooter(slide3, 3);
            addHeader(slide3, "Story Summary", "NARRATIVE ARC");

            const colW = 2.8;
            const gap = 0.3;

            // Act 1
            slide3.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.5, w: colW, h: 3.5, fill: { color: "FAFAFA" } });
            slide3.addText("ACT I", { x: 0.6, y: 1.6, fontSize: 12, bold: true, color: accentColor });
            slide3.addText(content.storySummarySlide.act1, { x: 0.6, y: 2.0, w: colW - 0.2, fontSize: 11, color: textColor });

            // Act 2
            slide3.addShape(pptx.ShapeType.rect, { x: 0.5 + colW + gap, y: 1.5, w: colW, h: 3.5, fill: { color: "FAFAFA" } });
            slide3.addText("ACT II", { x: 0.6 + colW + gap, y: 1.6, fontSize: 12, bold: true, color: accentColor });
            slide3.addText(content.storySummarySlide.act2, { x: 0.6 + colW + gap, y: 2.0, w: colW - 0.2, fontSize: 11, color: textColor });

            // Act 3
            slide3.addShape(pptx.ShapeType.rect, { x: 0.5 + 2 * (colW + gap), y: 1.5, w: colW, h: 3.5, fill: { color: "FAFAFA" } });
            slide3.addText("ACT III", { x: 0.6 + 2 * (colW + gap), y: 1.6, fontSize: 12, bold: true, color: accentColor });
            slide3.addText(content.storySummarySlide.act3, { x: 0.6 + 2 * (colW + gap), y: 2.0, w: colW - 0.2, fontSize: 11, color: textColor });


            // --- 4. KEY CHARACTERS ---
            const slide4 = pptx.addSlide();
            addFooter(slide4, 4);
            addHeader(slide4, "Key Characters", "CAST");

            content.characterSlides.slice(0, 3).forEach((char, index) => {
                const yPos = 1.5 + (index * 1.2);
                slide4.addText(char.name.toUpperCase(), { x: 0.5, y: yPos, w: 3, fontSize: 16, bold: true, color: primaryColor });
                slide4.addText(char.role, { x: 0.5, y: yPos + 0.3, w: 3, fontSize: 11, italic: true, color: secondaryColor });
                slide4.addText(char.description, { x: 3.5, y: yPos, w: 6, fontSize: 12, color: textColor });
            });

            // --- 5. THEMES & MESSAGE ---
            const slide5 = pptx.addSlide();
            addFooter(slide5, 5);
            addHeader(slide5, "Themes & Message", "CORE MEANING");

            slide5.addText(content.themesSlide.content, {
                x: 0.5, y: 2, w: 9, fontSize: 16, color: textColor, lineSpacing: 24, align: "center"
            });

            // --- 6. TARGET AUDIENCE ---
            const slide6 = pptx.addSlide();
            addFooter(slide6, 6);
            addHeader(slide6, "Target Audience", "MARKET");

            slide6.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.8, w: 9, h: 2.5, fill: { color: "F4F4F4" } });
            slide6.addText(content.targetAudienceSlide.content, {
                x: 1, y: 2.2, w: 8, fontSize: 14, color: textColor, align: "center"
            });

            // --- 7. VISUAL STYLE ---
            const slide7 = pptx.addSlide();
            slide7.background = { color: "111111" };
            addFooter(slide7, 7);

            slide7.addText("AESTHETICS", { x: 0.5, y: 0.4, fontSize: 10, color: accentColor, bold: true, charSpacing: 3 });
            slide7.addText("Visual Style", { x: 0.5, y: 0.8, fontSize: 24, color: "FFFFFF", bold: true, fontFace: titleFont });

            slide7.addText(content.visualStyleSlide.content, {
                x: 0.5, y: 1.5, w: 9, fontSize: 14, color: "DDDDDD", lineSpacing: 22
            });

            // --- 8. COMPARABLE FILMS ---
            const slide8 = pptx.addSlide();
            addFooter(slide8, 8);
            addHeader(slide8, "Comparable Films", "REFERENCE");

            slide8.addText(content.comparablesSlide.content, {
                x: 0.5, y: 1.8, w: 9, fontSize: 16, color: textColor
            });

            // --- 9. ESTIMATED BUDGET RANGE ---
            const slide9 = pptx.addSlide();
            addFooter(slide9, 9);
            addHeader(slide9, "Estimated Budget", "FINANCIALS");

            slide9.addShape(pptx.ShapeType.rect, { x: 2, y: 2, w: 6, h: 2, line: { color: accentColor, width: 3 }, fill: { type: "none" } });
            slide9.addText(content.budgetSlide.content, {
                x: 2.5, y: 2.5, w: 5, fontSize: 20, bold: true, color: primaryColor, align: "center"
            });

            // --- 10. WHY THIS FILM WILL WORK ---
            const slide10 = pptx.addSlide();
            addFooter(slide10, 10);
            addHeader(slide10, "Why This Film Will Work", "THE PITCH");

            slide10.addText(content.whyWorkSlide.content, {
                x: 0.5, y: 1.8, w: 9, fontSize: 16, color: textColor, lineSpacing: 24
            });


            pptx.writeFile({ fileName: `${filmData.title.replace(/[^a-z0-9]/gi, '_')}_StandardDeck.pptx` });

        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : "Failed to generate presentation.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-10 bg-white rounded-2xl shadow-xl border border-gray-100 text-center">
            <div className="mb-8">
                <div className="inline-flex p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-6">
                    <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-3 block">Ready to Generate</h2>
                <div className="flex justify-center gap-6 text-sm text-gray-500 mb-6">
                    <span className="flex items-center gap-1"><Layout className="w-4 h-4" /> Standard 10-Slide Format</span>
                    <span className="flex items-center gap-1"><Palette className="w-4 h-4" /> Cinematic Style</span>
                </div>
                <p className="text-gray-600 max-w-lg mx-auto leading-relaxed">
                    We have aligned the data to the industry standard pitch deck format.
                    Click below to generate.
                </p>
            </div>

            <button
                onClick={generatePPT}
                disabled={isGenerating}
                className="group relative w-full max-w-sm mx-auto overflow-hidden rounded-xl bg-black p-4 transition-all hover:bg-gray-900 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                <div className="relative flex items-center justify-center gap-3 text-lg font-bold text-white">
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <span>Writing Slides...</span>
                        </>
                    ) : (
                        <>
                            <Download className="w-6 h-6 transition-transform group-hover:-translate-y-1" />
                            <span>Download Standard Deck</span>
                        </>
                    )}
                </div>
            </button>
            <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-3">Project Summary</p>
                <div className="inline-block bg-gray-50 px-6 py-3 rounded-full text-sm font-medium text-gray-700">
                    {filmData.title} <span className="mx-2 text-gray-300">|</span> {filmData.genre}
                </div>
            </div>
        </div>
    );
}
