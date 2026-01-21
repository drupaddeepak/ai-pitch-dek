"use client";

import { useState } from "react";
import { Character, FilmData } from "../types";
import { Wand2, Save, Edit3 } from "lucide-react";

interface CharacterEditorProps {
    filmData: FilmData;
    onSave: (updatedCharacters: Character[]) => void;
}

export default function CharacterEditor({ filmData, onSave }: CharacterEditorProps) {
    const [characters, setCharacters] = useState<Character[]>(filmData.characters);
    const [isRefining, setIsRefining] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const handleUpdateCharacter = (index: number, field: keyof Character, value: string) => {
        const updated = [...characters];
        updated[index] = { ...updated[index], [field]: value };
        setCharacters(updated);
    };

    const handleRefine = async () => {
        setIsRefining(true);
        try {
            const response = await fetch("/api/refine-characters", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    extractedData: filmData,
                    userEdits: characters,
                }),
            });

            if (!response.ok) throw new Error("Failed to refine characters");

            const data = await response.json();
            setCharacters(data.characters);
            setEditingIndex(null); // Exit edit mode after refinement
        } catch (error) {
            console.error(error);
            alert("Failed to refine characters using AI.");
        } finally {
            setIsRefining(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Characters</h2>
                <div className="flex gap-3">
                    <button
                        onClick={handleRefine}
                        disabled={isRefining}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                    >
                        <Wand2 className={`w-4 h-4 ${isRefining ? "animate-spin" : ""}`} />
                        {isRefining ? "AI Refining..." : "AI Refine Descriptions"}
                    </button>
                    <button
                        onClick={() => onSave(characters)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <Save className="w-4 h-4" />
                        Save & Continue
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {characters.map((char, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:border-blue-300 transition-colors">
                        {editingIndex === index ? (
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={char.name}
                                    onChange={(e) => handleUpdateCharacter(index, "name", e.target.value)}
                                    className="w-full p-2 border rounded font-bold"
                                    placeholder="Character Name"
                                />
                                <input
                                    type="text"
                                    value={char.role}
                                    onChange={(e) => handleUpdateCharacter(index, "role", e.target.value)}
                                    className="w-full p-2 border rounded text-sm text-gray-600"
                                    placeholder="Role (e.g. Protagonist)"
                                />
                                <textarea
                                    value={char.description}
                                    onChange={(e) => handleUpdateCharacter(index, "description", e.target.value)}
                                    className="w-full p-2 border rounded text-sm min-h-[100px]"
                                    placeholder="Character Description"
                                />
                                <button
                                    onClick={() => setEditingIndex(null)}
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    Done Editing
                                </button>
                            </div>
                        ) : (
                            <div className="relative group">
                                <button
                                    onClick={() => setEditingIndex(index)}
                                    className="absolute top-0 right-0 p-2 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-blue-600 transition-all"
                                >
                                    <Edit3 className="w-4 h-4" />
                                </button>
                                <h3 className="font-bold text-lg">{char.name}</h3>
                                <p className="text-sm text-gray-500 italic mb-2">{char.role}</p>
                                <p className="text-gray-700">{char.description}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
