export interface Character {
    name: string;
    role: string;
    description: string;
}

// Update FilmData interface
export interface FilmData {
    title: string;
    logline: string;
    genre: string;
    synopsis: string;
    storySummary: {
        act1: string;
        act2: string;
        act3: string;
    };
    characters: Character[];
    tone: string[];
    targetAudience: string;
    themes: string;
}

export interface Theme {
    primaryColors: string[];
    secondaryColors: string[];
    mood: string;
    fontStyles: string;
    designStyle: string[];
}

export interface SlideContent {
    titleSlide: { title: string; tagline: string };
    loglineSlide: { logline: string };
    storySummarySlide: {
        act1: string;
        act2: string;
        act3: string;
    };
    characterSlides: Character[];
    themesSlide: { title: string; content: string };
    visualStyleSlide: { title: string; content: string };
    targetAudienceSlide: { title: string; content: string };
    comparablesSlide: { title: string; content: string };
    budgetSlide: { title: string; content: string };
    whyWorkSlide: { title: string; content: string };
}
