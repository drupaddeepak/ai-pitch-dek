"use client";

import { useState } from "react";
import DocumentUpload from "../components/DocumentUpload";
import CharacterEditor from "../components/CharacterEditor";
// MoodboardUpload is skipped
import DeckGenerator from "../components/DeckGenerator";
import { FilmData, Theme, Character } from "../types";
import { CheckCircle2, ChevronRight } from "lucide-react";

export default function Home() {
  const [step, setStep] = useState<1 | 2 | 4>(1); // Skipped step 3
  const [filmData, setFilmData] = useState<FilmData | null>(null);
  const [theme, setTheme] = useState<Theme | null>(null);

  const handleDocumentAnalyzed = (data: FilmData) => {
    setFilmData(data);
    setStep(2);
  };

  const handleCharactersSaved = (updatedCharacters: Character[]) => {
    if (filmData) {
      setFilmData({ ...filmData, characters: updatedCharacters });

      // SKIP MOODBOARD STEP - Use Default Theme
      const defaultTheme: Theme = {
        primaryColors: ["#000000", "#1A1A1A"],
        secondaryColors: ["#D4AF37", "#C0C0C0"], // Gold/Silver accents
        mood: "Cinematic & Professional",
        fontStyles: "Sans-serif",
        designStyle: ["Minimalist", "Bold"]
      };
      setTheme(defaultTheme);
      setStep(4);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          AI Pitch Deck Generator
        </h1>
        <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
          <StepIndicator current={step} step={1} label="Upload" />
          <ChevronRight className="w-4 h-4" />
          <StepIndicator current={step} step={2} label="Chars" />
          <ChevronRight className="w-4 h-4" />
          {/* Step 3 Hidden */}
          <StepIndicator current={step} step={4} label="Generate" />
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-5xl">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">Start Project</h2>
              <p className="text-center text-gray-500 mb-8">Upload your script or treatment to begin.</p>
              <DocumentUpload onDataExtracted={handleDocumentAnalyzed} />
            </div>
          )}

          {step === 2 && filmData && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Refine Characters</h2>
                <p className="text-gray-500">Review and enhance character descriptions.</p>
              </div>
              <CharacterEditor filmData={filmData} onSave={handleCharactersSaved} />
            </div>
          )}

          {step === 4 && filmData && theme && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <DeckGenerator filmData={filmData} theme={theme} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function StepIndicator({ current, step, label }: { current: number; step: number; label: string }) {
  const isActive = current === step;
  const isCompleted = current > step;

  // Visual logic to keep step 3 hidden/skipped
  if (step === 3) return null;

  return (
    <div className={`flex items-center gap-2 ${isActive ? "text-blue-600" : isCompleted ? "text-green-600" : ""}`}>
      {isCompleted ? (
        <CheckCircle2 className="w-5 h-5" />
      ) : (
        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs border ${isActive ? "border-blue-600 bg-blue-50" : "border-gray-300"}`}>
          {step}
        </span>
      )}
      <span className={isActive ? "font-bold" : ""}>{label}</span>
    </div>
  );
}
