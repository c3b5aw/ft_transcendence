--
-- PostgreSQL database dump
--

-- Dumped from database version 11.14
-- Dumped by pg_dump version 11.14

-- Started on 2022-01-12 16:17:30 UTC

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

--
-- TOC entry 603 (class 1247 OID 16452)
-- Name: friends_status_enum; Type: TYPE; Schema: public; Owner: ft_root
--

CREATE TYPE public.friends_status_enum AS ENUM (
    '0',
    '1',
    '2'
);


ALTER TYPE public.friends_status_enum OWNER TO ft_root;

--
-- TOC entry 600 (class 1247 OID 16429)
-- Name: users_role_enum; Type: TYPE; Schema: public; Owner: ft_root
--

CREATE TYPE public.users_role_enum AS ENUM (
    '0',
    '1',
    '2'
);


ALTER TYPE public.users_role_enum OWNER TO ft_root;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 202 (class 1259 OID 16509)
-- Name: achievements; Type: TABLE; Schema: public; Owner: ft_root
--

CREATE TABLE public.achievements (
    id integer NOT NULL,
    name character varying(32) NOT NULL,
    description text NOT NULL,
    points integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.achievements OWNER TO ft_root;

--
-- TOC entry 201 (class 1259 OID 16507)
-- Name: achievements_id_seq; Type: SEQUENCE; Schema: public; Owner: ft_root
--

CREATE SEQUENCE public.achievements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.achievements_id_seq OWNER TO ft_root;

--
-- TOC entry 2983 (class 0 OID 0)
-- Dependencies: 201
-- Name: achievements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ft_root
--

ALTER SEQUENCE public.achievements_id_seq OWNED BY public.achievements.id;


--
-- TOC entry 198 (class 1259 OID 16484)
-- Name: friends; Type: TABLE; Schema: public; Owner: ft_root
--

CREATE TABLE public.friends (
    id integer NOT NULL,
    user_id integer NOT NULL,
    friend_id integer NOT NULL,
    status public.friends_status_enum DEFAULT '0'::public.friends_status_enum NOT NULL
);


ALTER TABLE public.friends OWNER TO ft_root;

--
-- TOC entry 197 (class 1259 OID 16482)
-- Name: friends_id_seq; Type: SEQUENCE; Schema: public; Owner: ft_root
--

CREATE SEQUENCE public.friends_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.friends_id_seq OWNER TO ft_root;

--
-- TOC entry 2984 (class 0 OID 0)
-- Dependencies: 197
-- Name: friends_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ft_root
--

ALTER SEQUENCE public.friends_id_seq OWNED BY public.friends.id;


--
-- TOC entry 200 (class 1259 OID 16493)
-- Name: matchs; Type: TABLE; Schema: public; Owner: ft_root
--

CREATE TABLE public.matchs (
    id integer NOT NULL,
    date timestamp without time zone DEFAULT now() NOT NULL,
    finished boolean DEFAULT false NOT NULL,
    duration integer DEFAULT 0 NOT NULL,
    player_1 integer DEFAULT 0 NOT NULL,
    player_2 integer DEFAULT 0 NOT NULL,
    player_1_score integer DEFAULT 0 NOT NULL,
    player_2_score integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.matchs OWNER TO ft_root;

--
-- TOC entry 199 (class 1259 OID 16491)
-- Name: matchs_id_seq; Type: SEQUENCE; Schema: public; Owner: ft_root
--

CREATE SEQUENCE public.matchs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.matchs_id_seq OWNER TO ft_root;

--
-- TOC entry 2985 (class 0 OID 0)
-- Dependencies: 199
-- Name: matchs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ft_root
--

ALTER SEQUENCE public.matchs_id_seq OWNED BY public.matchs.id;


--
-- TOC entry 196 (class 1259 OID 16407)
-- Name: users; Type: TABLE; Schema: public; Owner: ft_root
--

CREATE TABLE public.users (
    id integer NOT NULL,
    login character varying(64) NOT NULL,
    display_name character varying(64) NOT NULL,
    email character varying(64) NOT NULL,
    two_factor_auth boolean DEFAULT false NOT NULL,
    two_factor_auth_secret character varying(64),
    elo integer DEFAULT 1200 NOT NULL,
    played integer DEFAULT 0 NOT NULL,
    victories integer DEFAULT 0 NOT NULL,
    defeats integer DEFAULT 0 NOT NULL,
    connected boolean DEFAULT false NOT NULL,
    created timestamp without time zone DEFAULT now() NOT NULL,
    "lastLogin" timestamp without time zone DEFAULT now() NOT NULL,
    role public.users_role_enum DEFAULT '0'::public.users_role_enum NOT NULL
);


ALTER TABLE public.users OWNER TO ft_root;

--
-- TOC entry 204 (class 1259 OID 16521)
-- Name: users_achievements; Type: TABLE; Schema: public; Owner: ft_root
--

CREATE TABLE public.users_achievements (
    id integer NOT NULL,
    user_id integer NOT NULL,
    achievement_id integer NOT NULL,
    unlocked_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users_achievements OWNER TO ft_root;

--
-- TOC entry 203 (class 1259 OID 16519)
-- Name: users_achievements_id_seq; Type: SEQUENCE; Schema: public; Owner: ft_root
--

CREATE SEQUENCE public.users_achievements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_achievements_id_seq OWNER TO ft_root;

--
-- TOC entry 2986 (class 0 OID 0)
-- Dependencies: 203
-- Name: users_achievements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ft_root
--

ALTER SEQUENCE public.users_achievements_id_seq OWNED BY public.users_achievements.id;


--
-- TOC entry 2825 (class 2604 OID 16512)
-- Name: achievements id; Type: DEFAULT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.achievements ALTER COLUMN id SET DEFAULT nextval('public.achievements_id_seq'::regclass);


--
-- TOC entry 2815 (class 2604 OID 16487)
-- Name: friends id; Type: DEFAULT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.friends ALTER COLUMN id SET DEFAULT nextval('public.friends_id_seq'::regclass);


--
-- TOC entry 2817 (class 2604 OID 16496)
-- Name: matchs id; Type: DEFAULT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.matchs ALTER COLUMN id SET DEFAULT nextval('public.matchs_id_seq'::regclass);


--
-- TOC entry 2827 (class 2604 OID 16524)
-- Name: users_achievements id; Type: DEFAULT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.users_achievements ALTER COLUMN id SET DEFAULT nextval('public.users_achievements_id_seq'::regclass);


--
-- TOC entry 2974 (class 0 OID 16509)
-- Dependencies: 202
-- Data for Name: achievements; Type: TABLE DATA; Schema: public; Owner: ft_root
--

COPY public.achievements (id, name, description, points) FROM stdin;
1	Première Victoire	Vous avez gagné votre premier match. Bravo!	10
2	Dixième Victoire	Vous avez gagné votre dixième match. Bravo !	50
3	3-0	Une victoire écrasante !	100
\.


--
-- TOC entry 2970 (class 0 OID 16484)
-- Dependencies: 198
-- Data for Name: friends; Type: TABLE DATA; Schema: public; Owner: ft_root
--

COPY public.friends (id, user_id, friend_id, status) FROM stdin;
1	83781	77558	1
2	77558	77460	0
3	83781	77460	0
\.


--
-- TOC entry 2972 (class 0 OID 16493)
-- Dependencies: 200
-- Data for Name: matchs; Type: TABLE DATA; Schema: public; Owner: ft_root
--

COPY public.matchs (id, date, finished, duration, player_1, player_2, player_1_score, player_2_score) FROM stdin;
1	2022-01-12 16:00:00	t	0	83781	77558	3	0
2	2022-01-12 16:00:00	t	0	77460	83781	2	1
3	2022-01-12 16:00:00	t	0	77558	73316	1	2
4	2022-01-12 16:00:00	t	0	83781	73316	1	2
5	2022-01-12 16:00:00	t	0	73316	77558	2	1
6	2022-01-12 16:00:00	t	0	77460	83781	0	3
7	2022-01-12 16:00:00	t	0	77558	73316	1	2
8	2022-01-12 16:00:00	t	0	83781	77460	3	0
9	2022-01-12 16:00:00	t	0	77460	77558	0	3
10	2022-01-12 16:00:00	t	0	77460	73316	1	2
\.


--
-- TOC entry 2968 (class 0 OID 16407)
-- Dependencies: 196
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: ft_root
--

COPY public.users (id, login, display_name, email, two_factor_auth, two_factor_auth_secret, elo, played, victories, defeats, connected, created, "lastLogin", role) FROM stdin;
73316	jtrauque	jtrauque	jtrauque@student.42.fr	f	\N	1300	5	5	0	f	2022-01-12 16:00:00	2022-01-12 16:00:00	2
77460	nbascaul	nbascaul	nbascaul@student.42.fr	f	\N	1190	5	1	4	f	2022-01-12 16:00:00	2022-01-12 16:00:00	2
77558	eoliveir	eoliveir	eoliveir@student.42.fr	f	\N	1195	5	2	3	f	2022-01-12 16:00:00	2022-01-12 16:00:00	2
83781	sbeaujar	sbeaujar	sbeaujar@student.42.fr	f	\N	1195	5	2	3	f	2022-01-12 16:00:00	2022-01-12 16:00:00	2
\.


--
-- TOC entry 2976 (class 0 OID 16521)
-- Dependencies: 204
-- Data for Name: users_achievements; Type: TABLE DATA; Schema: public; Owner: ft_root
--

COPY public.users_achievements (id, user_id, achievement_id, unlocked_at) FROM stdin;
2	73316	1	2022-01-12 16:59:34.71353
3	77460	1	2022-01-12 16:59:34.71353
4	77558	1	2022-01-12 16:59:34.71353
5	83781	1	2022-01-12 16:59:34.71353
6	83781	3	2022-01-12 16:59:34.71353
7	77558	3	2022-01-12 16:59:34.71353
\.


--
-- TOC entry 2987 (class 0 OID 0)
-- Dependencies: 201
-- Name: achievements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ft_root
--

SELECT pg_catalog.setval('public.achievements_id_seq', 1, false);


--
-- TOC entry 2988 (class 0 OID 0)
-- Dependencies: 197
-- Name: friends_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ft_root
--

SELECT pg_catalog.setval('public.friends_id_seq', 1, true);


--
-- TOC entry 2989 (class 0 OID 0)
-- Dependencies: 199
-- Name: matchs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ft_root
--

SELECT pg_catalog.setval('public.matchs_id_seq', 1, false);


--
-- TOC entry 2990 (class 0 OID 0)
-- Dependencies: 203
-- Name: users_achievements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ft_root
--

SELECT pg_catalog.setval('public.users_achievements_id_seq', 7, true);


--
-- TOC entry 2842 (class 2606 OID 16505)
-- Name: matchs PK_0fdbc8e05ccfb9533008b132189; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.matchs
    ADD CONSTRAINT "PK_0fdbc8e05ccfb9533008b132189" PRIMARY KEY (id);


--
-- TOC entry 2844 (class 2606 OID 16518)
-- Name: achievements PK_1bc19c37c6249f70186f318d71d; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT "PK_1bc19c37c6249f70186f318d71d" PRIMARY KEY (id);


--
-- TOC entry 2840 (class 2606 OID 16490)
-- Name: friends PK_65e1b06a9f379ee5255054021e1; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.friends
    ADD CONSTRAINT "PK_65e1b06a9f379ee5255054021e1" PRIMARY KEY (id);


--
-- TOC entry 2846 (class 2606 OID 16527)
-- Name: users_achievements PK_914031cefc0461aedc7e259739d; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.users_achievements
    ADD CONSTRAINT "PK_914031cefc0461aedc7e259739d" PRIMARY KEY (id);


--
-- TOC entry 2830 (class 2606 OID 16419)
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- TOC entry 2832 (class 2606 OID 16421)
-- Name: users UQ_2d443082eccd5198f95f2a36e2c; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE (login);


--
-- TOC entry 2834 (class 2606 OID 16427)
-- Name: users UQ_666af67eb78f845f1ed7932f509; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_666af67eb78f845f1ed7932f509" UNIQUE (two_factor_auth_secret);


--
-- TOC entry 2836 (class 2606 OID 16425)
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- TOC entry 2838 (class 2606 OID 16423)
-- Name: users UQ_a72fa0bb46a03bedcd1745efb41; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_a72fa0bb46a03bedcd1745efb41" UNIQUE (display_name);


--
-- TOC entry 2982 (class 0 OID 0)
-- Dependencies: 3
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: ft_root
--

REVOKE ALL ON SCHEMA public FROM postgres;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO ft_root;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2022-01-12 16:17:31 UTC

--
-- PostgreSQL database dump complete
--

