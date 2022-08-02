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

INSERT INTO anime (name, image) VALUES ('Steins;Gate', 'https://cdn.myanimelist.net/images/anime/5/73199.jpg');
INSERT INTO anime (name, image) VALUES ('Inuyasha', 'https://cdn.myanimelist.net/images/anime/1589/95329.jpg');
INSERT INTO anime (name, image) VALUES ('Sword Art Online', 'https://cdn.myanimelist.net/images/anime/11/39717.jpg');
INSERT INTO anime (name, image) VALUES ('Full Metal Alchemist Brotherhood', 'https://cdn.myanimelist.net/images/anime/1223/96541.jpg');
INSERT INTO anime (name, image) VALUES ('Princess Mononoke', 'https://cdn.myanimelist.net/images/anime/7/75919.jpg');
INSERT INTO anime (name, image) VALUES ('Eureka Seven', 'https://cdn.myanimelist.net/images/anime/12/34443.jpg');
INSERT INTO anime (name, image) VALUES ('Your Name', 'https://cdn.myanimelist.net/images/anime/5/87048.jpg');

INSERT INTO reviews (anime, review, reviewer) VALUES ('Steins;Gate', 'the greatest sci-fi thriller in anime history', 'gerard');
INSERT INTO reviews (anime, review, reviewer) VALUES ('Sword Art Online', 'trash', 'randy');
INSERT INTO reviews (anime, review, reviewer) VALUES ('Sword Art Online', 'the first season was good', 'alex');
INSERT INTO reviews (anime, review, reviewer) VALUES ('Inuyasha', 'ugh it was sooo good', 'martha');
INSERT INTO reviews (anime, review, reviewer) VALUES ('Sword Art Online', 'YA THE FIRST SEASON', 'martha');
INSERT INTO reviews (anime, review, reviewer) VALUES ('Full Metal Alchemist Brotherhood', 'my favorite', 'charles');
INSERT INTO reviews (anime, review, reviewer) VALUES ('Princess Mononoke', 'i really liked princess mononoke', 'alex');
INSERT INTO reviews (anime, review, reviewer) VALUES ('Eureka Seven', 'ya u right it is 50 episodes', 'randy');