"use client";

import { useState } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";
import { FilmData } from "../types";

interface DocumentUploadProps {
    onDataExtracted: (data: FilmData) => void;
}

export default function DocumentUpload({ onDataExtracted }: DocumentUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/analyze-document", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || "Failed to analyze document");
            }

            const data: FilmData = await response.json();
            onDataExtracted(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Error analyzing document";
            setError(errorMessage);
            console.error(err);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-center hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-blue-100 rounded-full text-blue-600">
                    {isUploading ? (
                        <Loader2 className="w-8 h-8 animate-spin" />
                    ) : (
                        <Upload className="w-8 h-8" />
                    )}
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-2">Upload Script or Treatment</h3>
                    <p className="text-gray-500 mb-4">
                        Upload your PDF or DOC document to let AI extract the details.
                    </p>
                </div>

                <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                    <span>{isUploading ? "Analyzing..." : "Choose File"}</span>
                    <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                    />
                </label>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
        </div>
    );
}
