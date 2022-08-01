DROP TABLE IF EXISTS weebs CASCADE;
DROP TABLE IF EXISTS anime CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;

CREATE TABLE weebs (
    weeb_id SERIAL,
    name TEXT UNIQUE
);

CREATE TABLE anime (
    anime_id SERIAL,
    name TEXT UNIQUE,
    image TEXT
);

CREATE TABLE reviews (
    review_id SERIAL,
    anime TEXT NOT NULL REFERENCES anime (name) ON DELETE CASCADE,
    review TEXT,
    reviewer TEXT NOT NULL REFERENCES weebs (name) ON DELETE CASCADE  
);

INSERT INTO weebs (name) VALUES ('gerard');
INSERT INTO weebs (name) VALUES ('randy');
INSERT INTO weebs (name) VALUES ('charles');
INSERT INTO weebs (name) VALUES ('alex');
INSERT INTO weebs (name) VALUES ('martha');

INSERT INTO anime (name, image) VALUES ('steins;gate', 'https://cdn.myanimelist.net/images/anime/5/73199.jpg');
INSERT INTO anime (name, image) VALUES ('inuyasha', 'https://cdn.myanimelist.net/images/anime/1589/95329.jpg');
INSERT INTO anime (name, image) VALUES ('sword art online', 'https://cdn.myanimelist.net/images/anime/11/39717.jpg');
INSERT INTO anime (name, image) VALUES ('full metal alchemist brotherhood', 'https://cdn.myanimelist.net/images/anime/1223/96541.jpg');
INSERT INTO anime (name, image) VALUES ('princess mononoke', 'https://cdn.myanimelist.net/images/anime/7/75919.jpg');
INSERT INTO anime (name, image) VALUES ('eureka seven', 'https://cdn.myanimelist.net/images/anime/12/34443.jpg');
INSERT INTO anime (name, image) VALUES ('your name', 'https://cdn.myanimelist.net/images/anime/5/87048.jpg');

INSERT INTO reviews (anime, review, reviewer) VALUES ('steins;gate', 'the greatest sci-fi thriller in anime history', 'gerard');
INSERT INTO reviews (anime, review, reviewer) VALUES ('sword art online', 'trash', 'randy');
INSERT INTO reviews (anime, review, reviewer) VALUES ('sword art online', 'the first season was good', 'alex');
INSERT INTO reviews (anime, review, reviewer) VALUES ('inuyasha', 'ugh it was sooo good', 'martha');
INSERT INTO reviews (anime, review, reviewer) VALUES ('sword art online', 'YA THE FIRST SEASON', 'martha');
INSERT INTO reviews (anime, review, reviewer) VALUES ('full metal alchemist brotherhood', 'my favorite', 'charles');
INSERT INTO reviews (anime, review, reviewer) VALUES ('princess mononoke', 'i really liked princess mononoke', 'alex');
INSERT INTO reviews (anime, review, reviewer) VALUES ('eureka seven', 'ya u right it is 50 episodes', 'randy');