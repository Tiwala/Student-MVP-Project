import express from 'express'
import fs from 'fs'
import pg from 'pg'

const app = express();
const PORT = 6969;

app.use(express.static("static"));

const pool = new pg.Pool({
    database: 'weeblist'
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

app.get('/anime', (req, res, next) => {
    pool.query('SELECT * FROM anime').then((data) => {
        res.send(data.rows);
    }).catch(next)
})

app.get('/reviews', (req, res, next) => {
    pool.query('SELECT * FROM reviews').then((data) => {
        res.send(data.rows);
    }).catch(next)
})

app.use(unknownHTTP);

app.use(internalError);

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});