const fs = require('fs');
const express = require('express');
const path = require('path'); // Import path module
const app = express();
const port = 3000;

// For handling JSON data
app.use(express.json());

// Middleware to serve static files
app.use(express.static(path.join(__dirname, '../'))); // Serve static files from the parent directory

// Endpoint to get random word and hints
app.get('/api/random-word', (req, res) => {
    const wordData = getRandomWord();
    res.json(wordData);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Function to return a random word with hints
function getRandomWord() {
    const words = JSON.parse(fs.readFileSync(path.join(__dirname, 'words.json'), 'utf-8'));


    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
}
