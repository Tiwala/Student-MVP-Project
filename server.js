import express from 'express'
import pg from 'pg'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Configures environmental variables
dotenv.config();

// Global constants
const app = express();
const PORT = process.env.PORT || 5000;

// Define __dirname for ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Makes sure you are connected
// const dbConfig = {
//     connectionString: process.env.DATABASE_URL
// };

// if (process.env.NODE_ENV === "production") {
//     dbConfig.ssl = {
//         rejectUnauthorized: false
//     };
// }

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

// THIS looks for which static files it serves
// app.use(express.static("static"));

app.use(express.static(path.join(__dirname, 'static')));

// const pool = new pg.Pool({
//     database: process.env.PGDATABASE
// });

// Log database connection status
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client', err.stack);
    } else {
        console.log('Database connected successfully');
        release();
    }
});

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

// Error handler for if they have an unknown path
const unknownHTTP = (req, res, next) => {
    res.sendStatus(404);
}

// If my code is wrong
const internalError = (err, req, res, next) => {
    // console.log("you fucked up bruh INTERNAL ERROR");
    res.status(500).send('Internal Server Error');
}

// Parses shit for us
app.use(express.json());

// Gets list of weebs from weebs table
app.get('/weebs', (req, res, next) => {
    pool.query('SELECT * FROM weebs').then((data) => {
        res.send(data.rows);
    }).catch(next)
})

// Gets specific weeb
app.get('/weebs/:weeb', (req, res, next) => {
    const weebName = req.params.weeb;
    pool.query(`SELECT * FROM weebs WHERE name = $1;`, [weebName]).then((data) => {
        const weeb = data.rows[0];
        if (weeb) {
            res.send(weeb);
        } else {
            res.status(404);
            res.send(`The weeb ${weebName} does not exist`);
        }
    }).catch(next)
})

// Registers the weeb
app.post('/weebs', (req, res, next) => {
    const newWeeb = req.body;
    if (!newWeeb.name) {
        res.status(400);
        res.send('Bad Request');
    } else {
        pool.query(`INSERT INTO weebs (name) VALUES ($1) RETURNING *;`, [newWeeb.name])
        .then((data) => {
            res.send(data.rows[0]);
        }).catch(next);
    }
})

// Deletes weeb; also deletes their review
app.delete('/weebs/:weeb', (req, res, next) => {
    const weebName = req.params.weeb;
    pool.query(`DELETE FROM weebs WHERE name = $1 RETURNING *;`, [weebName]).then((data) => {
        if (data.rows[0] === undefined) {
            res.status(404);
            res.send(`The weeb ${weebName} does not exist`)
        } else {
            res.send(data.rows[0]);
        }
    }).catch(next);
})

// Gets anime list from anime table
app.get('/anime', (req, res, next) => {
    console.log("This is the get request for the anime table");
    pool.query('SELECT * FROM anime').then((data) => {
        // console.log("the anime list response")
        // console.log(data.rows)
        res.send(data.rows);
    }).catch(next)
})

// Gets specific anime from anime table
app.get('/anime/:anime', (req, res, next) => {
    const animeName = req.params.anime;
    pool.query(`SELECT * FROM anime WHERE name = $1;`, [animeName]).then((data) => {
        const anime = data.rows[0];
        if (anime) {
            res.send(anime);
        } else {
            res.status(404);
            res.send(`Invalid anime given: ${animeName}`);
        }
    }).catch(next)
})

// Posts new anime
app.post('/anime', (req, res, next) => {
    const newAnime = req.body;
    if (!newAnime.name) {
        res.status(400);
        res.send('Bad Request');
    } else {
        pool.query(`INSERT INTO anime (name) VALUES ($1) RETURNING *;`, [newAnime.name])
        .then((data) => {
            res.send(data.rows[0]);
        }).catch(next);
    }
})

// Gets list of reviews
app.get('/reviews', (req, res, next) => {
    pool.query('SELECT * FROM reviews').then((data) => {
        res.send(data.rows);
    }).catch(next)
})

// // Isolates specific review by id
// app.get('/reviews/:id', (req, res, next) => {
//     const id = req.params.id;
//     pool.query(`SELECT * FROM reviews WHERE review_id = $1;`, [id]).then((data) => {
//         const review = data.rows[0];
//         if (review) {
//             res.send(review);
//         } else {
//             res.status(404);
//             res.send(`Invalid ID given: ${id}`);
//         }
//     }).catch(next)
// })

// Gets reviews by anime
app.get('/reviews/:anime', (req, res, next) => {
    const animeName = req.params.anime;
    pool.query(`SELECT * FROM reviews WHERE anime = $1;`, [animeName]).then((data) => {
        const review = data.rows;
        if (review) {
            res.send(review);
        } else {
            res.status(404);
            res.send(`Invalid anime given: ${animeName}`);
        }
    }).catch(next)
})

// Gets reviews by weeb
app.get('/reviews/byWeeb/:reviewer', (req, res, next) => {
    const reviewerName = req.params.reviewer;
    pool.query(`SELECT * FROM reviews WHERE reviewer = $1;`, [reviewerName]).then((data) => {
        const review = data.rows;
        if (review) {
            res.send(review);
        } else {
            res.status(404);
            res.send(`Invalid ID given: ${reviewerName}`);
        }
    }).catch(next)
})

// Posts new reviews; will only let you post if the weeb is registered and anime is in anime table
app.post('/reviews', (req, res, next) => {
    const newReview = req.body;
    if (!newReview.anime || !newReview.review || !newReview.reviewer) {
        res.status(400);
        res.send('Bad Request');
    } else {
        pool.query(`INSERT INTO reviews (anime, review, reviewer) VALUES ($1, $2, $3) RETURNING *;`, [newReview.anime, newReview.review, newReview.reviewer])
        .then((data) => {
            res.send(data.rows[0]);
        }).catch(next);
    }
})

// Updates reviews
app.patch('/reviews/:id', (req, res, next) => {
    const updatedReview = req.body;
    const id = req.params.id;
    if (!updatedReview.review) {
        res.status(400);
        res.send('Bad Request');
    } else {
        pool.query(`UPDATE reviews
        SET review = COALESCE($1, review)
        WHERE review_id = $2
        RETURNING *;`, [updatedReview.review, id])
        .then((data) => {
            if (data.rows.length === 0) {
                res.status(404);
                res.send(`INVALID ID given: ${id}`);
            } else {
                res.send(data.rows[0]);
            }
        }).catch(next);
    }
})

// Deletes reviews
app.delete('/reviews/:id', (req, res, next) => {
    const id = req.params.id;
    pool.query(`DELETE FROM reviews
    WHERE review_id = $1 RETURNING *;`, [id])
    .then((data) => {
        if (data.rows[0] === undefined) {
            res.status(404);
            res.send(`The review at id ${id} does not exist!`)
        } else {
            res.send(data.rows[0]);
        }
    }).catch(next);
})

app.use(unknownHTTP);

app.use(internalError);

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});