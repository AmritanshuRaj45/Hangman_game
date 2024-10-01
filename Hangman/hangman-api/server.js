const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// For handling JSON data
app.use(express.json());

// Middleware to serve static files
app.use(express.static(path.join(__dirname, '../'))); // Serve static files from the parent directory

// Endpoint to get a random word and hints
app.get('/api/random-word', (req, res) => {
    const wordData = getRandomWord();
    res.json(wordData);
});

// Endpoint to suggest a new word
app.post('/api/words', (req, res) => {
    const { word, hint, extraHint } = req.body; // Destructure the incoming data
    if (!word || !hint) {
        return res.status(400).json({ message: 'Word and hint are required' });
    }

    const words = getWordsFromFile();
    words.push({ word, hint, extraHint: extraHint || "" }); // Add new word, hint, and extra hint to the array
    saveWordsToFile(words); // Save updated array back to file
    res.status(201).json({ message: 'Word added successfully', word, hint, extraHint });
});

// Function to read words from the JSON file
function getWordsFromFile() {
    const filePath = path.join(__dirname, 'words.json');
    if (!fs.existsSync(filePath)) {
        return []; // Return an empty array if the file doesn't exist
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// Function to save words back to the JSON file
function saveWordsToFile(words) {
    fs.writeFileSync(path.join(__dirname, 'words.json'), JSON.stringify(words, null, 2), 'utf-8');
}

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Function to return a random word with hints
function getRandomWord() {
    const words = getWordsFromFile();
    if (words.length === 0) {
        return { word: '', hint: '', extraHint: '' }; // Return empty if no words are available
    }
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
}
