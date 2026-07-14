const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve the static frontend files
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`🧠 EEG Visualizer running at http://localhost:${PORT}`);
});
