import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configures environmental variables
dotenv.config();

// Log environment variables
console.log('Environment Variables:');
console.log('PORT:', process.env.PORT);
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('DATABASE_PUBLIC_URL:', process.env.DATABASE_PUBLIC_URL);

// Global constants
const app = express();
const PORT = process.env.PORT || 5000;

// Define __dirname for ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine which database URL to use
const DATABASE_URL = process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL;

// Log the database URL being used
console.log('Using DATABASE_URL:', DATABASE_URL);

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