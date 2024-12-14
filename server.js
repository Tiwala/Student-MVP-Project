import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configures environmental variables
dotenv.config();

// Global constants
const app = express();
const PORT = process.env.PORT || 5000;

// Define __dirname for ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Basic route to check server status
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Error handler for if they have an unknown path
const unknownHTTP = (req, res, next) => {
    res.sendStatus(404);
}

// If my code is wrong
const internalError = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});