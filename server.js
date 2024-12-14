import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Configures environmental variables
dotenv.config();

// Global constants
const app = express();
const PORT = process.env.PORT || 5000;

// Define __dirname for ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine which database URL to use
const DATABASE_URL = process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL;

// PostgreSQL connection configuration
const dbConfig = {
    connectionString: DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
};

const pool = new pg.Pool(dbConfig);

// Log database connection status
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client', err.stack);
    } else {
        console.log('Database connected successfully');
        release();
    }
});

// Serve static files from the "static" directory
app.use(express.static(path.join(__dirname, 'static')));

// Serve the log file for debugging
app.get('/logs', (req, res) => {
    const logFilePath = path.join(__dirname, 'server.log');
    fs.readFile(logFilePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading log file');
        } else {
            res.type('text/plain').send(data);
        }
    });
});

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