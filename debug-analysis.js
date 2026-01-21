const fs = require('fs');
const path = require('path');

async function testAnalyze() {
    const filePath = path.join(__dirname, 'test-doc.txt');
    fs.writeFileSync(filePath, "Title: The Last Star\nGenre: Sci-Fi\nLogline: A starship captain fights to save the last sun.\nSynopsis: Captain Aara discovers the sun is dying. She rallies a crew. They sacrifice the ship to reignite the star.\nCharacters: Aara - Brave Captain. Kael - Loyal Engineer.\nTone: Dark, Epic.\nTarget Audience: Sci-Fi fans.");

    const formData = new FormData();
    const file = new Blob([fs.readFileSync(filePath)], { type: 'text/plain' });
    formData.append('file', file, 'test-doc.txt');

    try {
        console.log("Sending request...");
        const response = await fetch('http://localhost:3000/api/analyze-document', {
            method: 'POST',
            body: formData
        });

        const text = await response.text();
        console.log("Status:", response.status);
        console.log("Response Body:", text);
    } catch (e) {
        console.error("Fetch error:", e);
    }
}

testAnalyze();
