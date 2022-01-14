--
-- PostgreSQL database dump
--

-- Dumped from database version 11.14
-- Dumped by pg_dump version 11.14

-- Started on 2022-01-14 17:00:45 UTC

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
-- TOC entry 606 (class 1247 OID 16408)
-- Name: friends_status_enum; Type: TYPE; Schema: public; Owner: ft_root
--

CREATE TYPE public.friends_status_enum AS ENUM (
    '0',
    '1',
    '2'
);


ALTER TYPE public.friends_status_enum OWNER TO ft_root;

--
-- TOC entry 623 (class 1247 OID 16494)
-- Name: matchs_type_enum; Type: TYPE; Schema: public; Owner: ft_root
--

CREATE TYPE public.matchs_type_enum AS ENUM (
    '0',
    '1',
    '2'
);


ALTER TYPE public.matchs_type_enum OWNER TO ft_root;

--
-- TOC entry 613 (class 1247 OID 16442)
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
-- TOC entry 197 (class 1259 OID 16388)
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
-- TOC entry 196 (class 1259 OID 16386)
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
-- TOC entry 2988 (class 0 OID 0)
-- Dependencies: 196
-- Name: achievements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ft_root
--

ALTER SEQUENCE public.achievements_id_seq OWNED BY public.achievements.id;


--
-- TOC entry 201 (class 1259 OID 16417)
-- Name: friends; Type: TABLE; Schema: public; Owner: ft_root
--

CREATE TABLE public.friends (
    id integer NOT NULL,
    user_id integer NOT NULL,
    user_login character varying(64) NOT NULL,
    friend_id integer NOT NULL,
    friend_login character varying(64) NOT NULL,
    status public.friends_status_enum DEFAULT '0'::public.friends_status_enum NOT NULL
);


ALTER TABLE public.friends OWNER TO ft_root;

--
-- TOC entry 200 (class 1259 OID 16415)
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
-- TOC entry 2989 (class 0 OID 0)
-- Dependencies: 200
-- Name: friends_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ft_root
--

ALTER SEQUENCE public.friends_id_seq OWNED BY public.friends.id;


--
-- TOC entry 204 (class 1259 OID 16474)
-- Name: matchs; Type: TABLE; Schema: public; Owner: ft_root
--

CREATE TABLE public.matchs (
    id integer NOT NULL,
    date timestamp without time zone DEFAULT now() NOT NULL,
    finished boolean DEFAULT false NOT NULL,
    duration integer DEFAULT 0 NOT NULL,
    player_1_id integer DEFAULT 0 NOT NULL,
    player_1_score integer DEFAULT 0 NOT NULL,
    player_2_id integer DEFAULT 0 NOT NULL,
    player_2_score integer DEFAULT 0 NOT NULL,
    player_1_login character varying(64) NOT NULL,
    player_2_login character varying(64) NOT NULL,
    type public.matchs_type_enum DEFAULT '0'::public.matchs_type_enum NOT NULL
);


ALTER TABLE public.matchs OWNER TO ft_root;

--
-- TOC entry 203 (class 1259 OID 16472)
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
-- TOC entry 2990 (class 0 OID 0)
-- Dependencies: 203
-- Name: matchs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ft_root
--

ALTER SEQUENCE public.matchs_id_seq OWNED BY public.matchs.id;


--
-- TOC entry 202 (class 1259 OID 16449)
-- Name: users; Type: TABLE; Schema: public; Owner: ft_root
--

CREATE TABLE public.users (
    id integer NOT NULL,
    login character varying(64) NOT NULL,
    display_name character varying(64) NOT NULL,
    email character varying(64) NOT NULL,
    role public.users_role_enum DEFAULT '0'::public.users_role_enum NOT NULL,
    banned boolean DEFAULT false NOT NULL,
    two_factor_auth boolean DEFAULT false NOT NULL,
    two_factor_auth_secret character varying(64),
    elo integer DEFAULT 1200 NOT NULL,
    played integer DEFAULT 0 NOT NULL,
    victories integer DEFAULT 0 NOT NULL,
    defeats integer DEFAULT 0 NOT NULL,
    connected boolean DEFAULT false NOT NULL,
    created timestamp without time zone DEFAULT now() NOT NULL,
    "lastLogin" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO ft_root;

--
-- TOC entry 199 (class 1259 OID 16400)
-- Name: users_achievements; Type: TABLE; Schema: public; Owner: ft_root
--

CREATE TABLE public.users_achievements (
    id integer NOT NULL,
    user_id integer NOT NULL,
    user_login character varying(64) NOT NULL,
    achievement_id integer NOT NULL,
    unlocked_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users_achievements OWNER TO ft_root;

--
-- TOC entry 198 (class 1259 OID 16398)
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
-- TOC entry 2991 (class 0 OID 0)
-- Dependencies: 198
-- Name: users_achievements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ft_root
--

ALTER SEQUENCE public.users_achievements_id_seq OWNED BY public.users_achievements.id;


--
-- TOC entry 2810 (class 2604 OID 16489)
-- Name: achievements id; Type: DEFAULT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.achievements ALTER COLUMN id SET DEFAULT nextval('public.achievements_id_seq'::regclass);


--
-- TOC entry 2814 (class 2604 OID 16490)
-- Name: friends id; Type: DEFAULT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.friends ALTER COLUMN id SET DEFAULT nextval('public.friends_id_seq'::regclass);


--
-- TOC entry 2832 (class 2604 OID 16491)
-- Name: matchs id; Type: DEFAULT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.matchs ALTER COLUMN id SET DEFAULT nextval('public.matchs_id_seq'::regclass);


--
-- TOC entry 2812 (class 2604 OID 16492)
-- Name: users_achievements id; Type: DEFAULT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.users_achievements ALTER COLUMN id SET DEFAULT nextval('public.users_achievements_id_seq'::regclass);


--
-- TOC entry 2974 (class 0 OID 16388)
-- Dependencies: 197
-- Data for Name: achievements; Type: TABLE DATA; Schema: public; Owner: ft_root
--

COPY public.achievements (id, name, description, points) FROM stdin;
1	Première Victoire	Vous avez gagné votre premier match. Bravo!	10
2	Dixième Victoire	Vous avez gagné votre dixième match. Bravo!	50
3	3-0	Une victoire écrasante !	100
\.


--
-- TOC entry 2978 (class 0 OID 16417)
-- Dependencies: 201
-- Data for Name: friends; Type: TABLE DATA; Schema: public; Owner: ft_root
--

COPY public.friends (id, user_id, user_login, friend_id, friend_login, status) FROM stdin;
1	83781	sbeaujar	77558	eoliveir	1
2	77558	eoliveir	77460	nbascaul	0
3	83781	sbeaujar	77460	nbascaul	0
\.


--
-- TOC entry 2981 (class 0 OID 16474)
-- Dependencies: 204
-- Data for Name: matchs; Type: TABLE DATA; Schema: public; Owner: ft_root
--

COPY public.matchs (id, date, finished, duration, player_1_id, player_1_score, player_2_id, player_2_score, player_1_login, player_2_login, type) FROM stdin;
1	2022-01-13 16:28:50.313128	t	1	83781	3	77558	0	sbeaujar	eoliveir	2
2	2022-01-13 16:28:50.313128	t	1	77460	2	83781	1	nbascaul	sbeaujar	2
3	2022-01-13 16:28:50.313128	t	1	77558	1	73316	2	eoliveir	jtrauque	2
4	2022-01-13 16:28:50.313128	t	1	83781	1	73316	2	sbeaujar	jtrauque	2
5	2022-01-13 16:28:50.313128	t	1	73316	2	77558	1	jtrauque	eoliveir	2
6	2022-01-13 16:28:50.313128	t	1	77460	0	83781	3	nbascaul	sbeaujar	2
7	2022-01-13 16:28:50.313128	t	1	77558	1	73316	2	eoliveir	jtrauque	2
8	2022-01-13 16:28:50.313128	t	1	83781	3	77460	0	sbeaujar	nbascaul	2
9	2022-01-13 16:28:50.313128	t	1	77460	0	77558	3	nbascaul	eoliveir	2
10	2022-01-13 16:28:50.313128	t	1	77460	1	73316	2	nbascaul	jtrauque	2
\.


--
-- TOC entry 2979 (class 0 OID 16449)
-- Dependencies: 202
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: ft_root
--

COPY public.users (id, login, display_name, email, role, banned, two_factor_auth, two_factor_auth_secret, elo, played, victories, defeats, connected, created, "lastLogin") FROM stdin;
77460	nbascaul	nbascaul	nbascaul@student.42.fr	2	f	f	\N	1200	5	1	4	f	2022-01-12 16:00:00	2022-01-12 16:00:00
77558	eoliveir	eoliveir	eoliveir@student.42.fr	2	f	f	\N	1200	5	2	3	f	2022-01-12 16:00:00	2022-01-12 16:00:00
83781	sbeaujar	Swan Beaujard	sbeaujar@student.42.fr	2	f	f	\N	1200	0	0	0	f	2022-01-14 16:20:18.032847	2022-01-14 16:12:25.767
73316	jtrauque	jtrauque	jtrauque@student.42.fr	2	f	f	\N	1200	5	5	0	f	2022-01-12 16:00:00	2022-01-12 16:00:00
\.


--
-- TOC entry 2976 (class 0 OID 16400)
-- Dependencies: 199
-- Data for Name: users_achievements; Type: TABLE DATA; Schema: public; Owner: ft_root
--

COPY public.users_achievements (id, user_id, user_login, achievement_id, unlocked_at) FROM stdin;
1	73316	jtrauque	1	2022-01-13 16:08:01.077515
2	77460	nbascaul	1	2022-01-13 16:08:01.077515
3	77558	eoliveir	1	2022-01-13 16:08:01.077515
4	83781	sbeaujar	1	2022-01-13 16:08:01.077515
5	83781	sbeaujar	3	2022-01-13 16:08:01.077515
6	77558	eoliveir	3	2022-01-13 16:08:01.077515
\.


--
-- TOC entry 2992 (class 0 OID 0)
-- Dependencies: 196
-- Name: achievements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ft_root
--

SELECT pg_catalog.setval('public.achievements_id_seq', 1, false);


--
-- TOC entry 2993 (class 0 OID 0)
-- Dependencies: 200
-- Name: friends_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ft_root
--

SELECT pg_catalog.setval('public.friends_id_seq', 3, true);


--
-- TOC entry 2994 (class 0 OID 0)
-- Dependencies: 203
-- Name: matchs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ft_root
--

SELECT pg_catalog.setval('public.matchs_id_seq', 10, true);


--
-- TOC entry 2995 (class 0 OID 0)
-- Dependencies: 198
-- Name: users_achievements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ft_root
--

SELECT pg_catalog.setval('public.users_achievements_id_seq', 6, true);


--
-- TOC entry 2851 (class 2606 OID 16488)
-- Name: matchs PK_0fdbc8e05ccfb9533008b132189; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.matchs
    ADD CONSTRAINT "PK_0fdbc8e05ccfb9533008b132189" PRIMARY KEY (id);


--
-- TOC entry 2835 (class 2606 OID 16397)
-- Name: achievements PK_1bc19c37c6249f70186f318d71d; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT "PK_1bc19c37c6249f70186f318d71d" PRIMARY KEY (id);


--
-- TOC entry 2839 (class 2606 OID 16423)
-- Name: friends PK_65e1b06a9f379ee5255054021e1; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.friends
    ADD CONSTRAINT "PK_65e1b06a9f379ee5255054021e1" PRIMARY KEY (id);


--
-- TOC entry 2837 (class 2606 OID 16406)
-- Name: users_achievements PK_914031cefc0461aedc7e259739d; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.users_achievements
    ADD CONSTRAINT "PK_914031cefc0461aedc7e259739d" PRIMARY KEY (id);


--
-- TOC entry 2841 (class 2606 OID 16463)
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- TOC entry 2843 (class 2606 OID 16465)
-- Name: users UQ_2d443082eccd5198f95f2a36e2c; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE (login);


--
-- TOC entry 2845 (class 2606 OID 16471)
-- Name: users UQ_666af67eb78f845f1ed7932f509; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_666af67eb78f845f1ed7932f509" UNIQUE (two_factor_auth_secret);


--
-- TOC entry 2847 (class 2606 OID 16469)
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- TOC entry 2849 (class 2606 OID 16467)
-- Name: users UQ_a72fa0bb46a03bedcd1745efb41; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_a72fa0bb46a03bedcd1745efb41" UNIQUE (display_name);


--
-- TOC entry 2987 (class 0 OID 0)
-- Dependencies: 3
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: ft_root
--

REVOKE ALL ON SCHEMA public FROM postgres;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO ft_root;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2022-01-14 17:00:45 UTC

--
-- PostgreSQL database dump complete
--

