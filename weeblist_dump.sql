--
-- PostgreSQL database dump
--

-- Dumped from database version 14.8 (Homebrew)
-- Dumped by pg_dump version 14.8 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: anime; Type: TABLE; Schema: public; Owner: gerardsanjuan
--

CREATE TABLE public.anime (
    anime_id integer NOT NULL,
    name text,
    image text
);


ALTER TABLE public.anime OWNER TO gerardsanjuan;

--
-- Name: anime_anime_id_seq; Type: SEQUENCE; Schema: public; Owner: gerardsanjuan
--

CREATE SEQUENCE public.anime_anime_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.anime_anime_id_seq OWNER TO gerardsanjuan;

--
-- Name: anime_anime_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gerardsanjuan
--

ALTER SEQUENCE public.anime_anime_id_seq OWNED BY public.anime.anime_id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: gerardsanjuan
--

CREATE TABLE public.reviews (
    review_id integer NOT NULL,
    anime text NOT NULL,
    review text,
    reviewer text NOT NULL
);


ALTER TABLE public.reviews OWNER TO gerardsanjuan;

--
-- Name: reviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: gerardsanjuan
--

CREATE SEQUENCE public.reviews_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reviews_review_id_seq OWNER TO gerardsanjuan;

--
-- Name: reviews_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gerardsanjuan
--

ALTER SEQUENCE public.reviews_review_id_seq OWNED BY public.reviews.review_id;


--
-- Name: weebs; Type: TABLE; Schema: public; Owner: gerardsanjuan
--

CREATE TABLE public.weebs (
    weeb_id integer NOT NULL,
    name text
);


ALTER TABLE public.weebs OWNER TO gerardsanjuan;

--
-- Name: weebs_weeb_id_seq; Type: SEQUENCE; Schema: public; Owner: gerardsanjuan
--

CREATE SEQUENCE public.weebs_weeb_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.weebs_weeb_id_seq OWNER TO gerardsanjuan;

--
-- Name: weebs_weeb_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gerardsanjuan
--

ALTER SEQUENCE public.weebs_weeb_id_seq OWNED BY public.weebs.weeb_id;


--
-- Name: anime anime_id; Type: DEFAULT; Schema: public; Owner: gerardsanjuan
--

ALTER TABLE ONLY public.anime ALTER COLUMN anime_id SET DEFAULT nextval('public.anime_anime_id_seq'::regclass);


--
-- Name: reviews review_id; Type: DEFAULT; Schema: public; Owner: gerardsanjuan
--

ALTER TABLE ONLY public.reviews ALTER COLUMN review_id SET DEFAULT nextval('public.reviews_review_id_seq'::regclass);


--
-- Name: weebs weeb_id; Type: DEFAULT; Schema: public; Owner: gerardsanjuan
--

ALTER TABLE ONLY public.weebs ALTER COLUMN weeb_id SET DEFAULT nextval('public.weebs_weeb_id_seq'::regclass);


--
-- Data for Name: anime; Type: TABLE DATA; Schema: public; Owner: gerardsanjuan
--

COPY public.anime (anime_id, name, image) FROM stdin;
1	Steins;Gate	https://cdn.myanimelist.net/images/anime/5/73199.jpg
2	Inuyasha	https://cdn.myanimelist.net/images/anime/1589/95329.jpg
3	Sword Art Online	https://cdn.myanimelist.net/images/anime/11/39717.jpg
4	Full Metal Alchemist Brotherhood	https://cdn.myanimelist.net/images/anime/1223/96541.jpg
5	Princess Mononoke	https://cdn.myanimelist.net/images/anime/7/75919.jpg
6	Eureka Seven	https://cdn.myanimelist.net/images/anime/12/34443.jpg
7	Your Name	https://cdn.myanimelist.net/images/anime/5/87048.jpg
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: gerardsanjuan
--

COPY public.reviews (review_id, anime, review, reviewer) FROM stdin;
2	Sword Art Online	trash	randy
3	Sword Art Online	the first season was good	alex
4	Inuyasha	ugh it was sooo good	martha
5	Sword Art Online	YA THE FIRST SEASON	martha
6	Full Metal Alchemist Brotherhood	my favorite	charles
7	Princess Mononoke	i really liked princess mononoke	alex
8	Eureka Seven	ya u right it is 50 episodes	randy
10	Your Name	amazing	gerard
14	Sword Art Online	it's ok	gerard
15	Sword Art Online	garbage	charles
21	Steins;Gate	probably the best sci-fi thriller of all time	gerard
\.


--
-- Data for Name: weebs; Type: TABLE DATA; Schema: public; Owner: gerardsanjuan
--

COPY public.weebs (weeb_id, name) FROM stdin;
1	gerard
2	randy
3	charles
4	alex
5	martha
6	drake
\.


--
-- Name: anime_anime_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gerardsanjuan
--

SELECT pg_catalog.setval('public.anime_anime_id_seq', 7, true);


--
-- Name: reviews_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gerardsanjuan
--

SELECT pg_catalog.setval('public.reviews_review_id_seq', 22, true);


--
-- Name: weebs_weeb_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gerardsanjuan
--

SELECT pg_catalog.setval('public.weebs_weeb_id_seq', 6, true);


--
-- Name: anime anime_name_key; Type: CONSTRAINT; Schema: public; Owner: gerardsanjuan
--

ALTER TABLE ONLY public.anime
    ADD CONSTRAINT anime_name_key UNIQUE (name);


--
-- Name: weebs weebs_name_key; Type: CONSTRAINT; Schema: public; Owner: gerardsanjuan
--

ALTER TABLE ONLY public.weebs
    ADD CONSTRAINT weebs_name_key UNIQUE (name);


--
-- Name: reviews reviews_anime_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gerardsanjuan
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_anime_fkey FOREIGN KEY (anime) REFERENCES public.anime(name) ON DELETE CASCADE;


--
-- Name: reviews reviews_reviewer_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gerardsanjuan
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_reviewer_fkey FOREIGN KEY (reviewer) REFERENCES public.weebs(name) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

