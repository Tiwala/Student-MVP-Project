import express from 'express'
import fs from 'fs'
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6969;

app.use(express.static("static"));

const pool = new pg.Pool({
    database: process.env.PGDATABASE
});

const unknownHTTP = (req, res, next) => {
    res.sendStatus(404);
}

const internalError = (err, req, res, next) => {
    res.status(500).send('Internal Server Error');
}

app.use(express.json());

app.get('/weebs', (req, res, next) => {
    pool.query('SELECT * FROM weebs').then((data) => {
        res.send(data.rows);
    }).catch(next)
})

app.get('/weebs/:id', (req, res, next) => {
    const id = req.params.id;
    pool.query(`SELECT * FROM weebs WHERE weeb_id = $1;`, [id]).then((data) => {
        const weeb = data.rows[0];
        if (weeb) {
            res.send(weeb);
        } else {
            res.status(404);
            res.send(`Invalid ID given: ${id}`);
        }
    }).catch(next)
})

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

app.get('/anime', (req, res, next) => {
    pool.query('SELECT * FROM anime').then((data) => {
        res.send(data.rows);
    }).catch(next)
})

app.get('/anime/:id', (req, res, next) => {
    const id = req.params.id;
    pool.query(`SELECT * FROM anime WHERE anime_id = $1;`, [id]).then((data) => {
        const anime = data.rows[0];
        if (anime) {
            res.send(anime);
        } else {
            res.status(404);
            res.send(`Invalid ID given: ${id}`);
        }
    }).catch(next)
})

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

app.get('/reviews', (req, res, next) => {
    pool.query('SELECT * FROM reviews').then((data) => {
        res.send(data.rows);
    }).catch(next)
})

app.get('/reviews/:id', (req, res, next) => {
    const id = req.params.id;
    pool.query(`SELECT * FROM reviews WHERE review_id = $1;`, [id]).then((data) => {
        const review = data.rows[0];
        if (review) {
            res.send(review);
        } else {
            res.status(404);
            res.send(`Invalid ID given: ${id}`);
        }
    }).catch(next)
})

app.post('/reviews', (req, res, next) => {
    const newReview = req.body;
    if (!newReview.anime || !newReview.review || !newReview.reviewer) {
        res.status(400);
        res.send('Bad Request');
    } else {
        pool.query(`INSERT INTO reviews (anime, review, reviewer) VALUES ($1, $2, $3) RETURNING *;`, [newReviews.review])
        .then((data) => {
            res.send(data.rows[0]);
        }).catch(next);
    }
})



app.use(unknownHTTP);

app.use(internalError);

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});