--
-- PostgreSQL database dump
--

-- Dumped from database version 11.14
-- Dumped by pg_dump version 11.14

-- Started on 2022-01-21 11:15:40 UTC

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
-- TOC entry 604 (class 1247 OID 16387)
-- Name: channels_users_role_enum; Type: TYPE; Schema: public; Owner: ft_root
--

CREATE TYPE public.channels_users_role_enum AS ENUM (
    'NONE',
    'BANNED',
    'MUTED',
    'MEMBER',
    'MODERATOR',
    'ADMIN'
);


ALTER TYPE public.channels_users_role_enum OWNER TO ft_root;

--
-- TOC entry 607 (class 1247 OID 16400)
-- Name: friends_status_enum; Type: TYPE; Schema: public; Owner: ft_root
--

CREATE TYPE public.friends_status_enum AS ENUM (
    'PENDING',
    'ACCEPTED',
    'BLOCKED'
);


ALTER TYPE public.friends_status_enum OWNER TO ft_root;

--
-- TOC entry 610 (class 1247 OID 16408)
-- Name: matchs_type_enum; Type: TYPE; Schema: public; Owner: ft_root
--

CREATE TYPE public.matchs_type_enum AS ENUM (
    'BOT',
    'NORMAL',
    'RANKED'
);


ALTER TYPE public.matchs_type_enum OWNER TO ft_root;

--
-- TOC entry 613 (class 1247 OID 16416)
-- Name: users_role_enum; Type: TYPE; Schema: public; Owner: ft_root
--

CREATE TYPE public.users_role_enum AS ENUM (
    'NONE',
    'BANNED',
    'MUTED',
    'MEMBER',
    'MODERATOR',
    'ADMIN'
);


ALTER TYPE public.users_role_enum OWNER TO ft_root;

--
-- TOC entry 649 (class 1247 OID 16533)
-- Name: users_status_enum; Type: TYPE; Schema: public; Owner: ft_root
--

CREATE TYPE public.users_status_enum AS ENUM (
    'OFFLINE',
    'ONLINE',
    'IN_GAME'
);


ALTER TYPE public.users_status_enum OWNER TO ft_root;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 196 (class 1259 OID 16429)
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
-- TOC entry 197 (class 1259 OID 16436)
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
-- TOC entry 3043 (class 0 OID 0)
-- Dependencies: 197
-- Name: achievements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ft_root
--

ALTER SEQUENCE public.achievements_id_seq OWNED BY public.achievements.id;


--
-- TOC entry 198 (class 1259 OID 16438)
-- Name: channels; Type: TABLE; Schema: public; Owner: ft_root
--

CREATE TABLE public.channels (
    id integer NOT NULL,
    name character varying(64) NOT NULL,
    password character varying(32),
    tunnel boolean DEFAULT false NOT NULL,
    private boolean DEFAULT false NOT NULL,
    owner_id integer NOT NULL
);


ALTER TABLE public.channels OWNER TO ft_root;

--
-- TOC entry 199 (class 1259 OID 16443)
-- Name: channels_id_seq; Type: SEQUENCE; Schema: public; Owner: ft_root
--

CREATE SEQUENCE public.channels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.channels_id_seq OWNER TO ft_root;

--
-- TOC entry 3044 (class 0 OID 0)
-- Dependencies: 199
-- Name: channels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ft_root
--

ALTER SEQUENCE public.channels_id_seq OWNED BY public.channels.id;


--
-- TOC entry 200 (class 1259 OID 16445)
-- Name: channels_users; Type: TABLE; Schema: public; Owner: ft_root
--

CREATE TABLE public.channels_users (
    id integer NOT NULL,
    role public.channels_users_role_enum DEFAULT 'MEMBER'::public.channels_users_role_enum NOT NULL,
    muted timestamp without time zone DEFAULT now() NOT NULL,
    channel_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.channels_users OWNER TO ft_root;

--
-- TOC entry 201 (class 1259 OID 16450)
-- Name: channels_users_id_seq; Type: SEQUENCE; Schema: public; Owner: ft_root
--

CREATE SEQUENCE public.channels_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.channels_users_id_seq OWNER TO ft_root;

--
-- TOC entry 3045 (class 0 OID 0)
-- Dependencies: 201
-- Name: channels_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ft_root
--

ALTER SEQUENCE public.channels_users_id_seq OWNED BY public.channels_users.id;


--
-- TOC entry 202 (class 1259 OID 16452)
-- Name: chat_messages; Type: TABLE; Schema: public; Owner: ft_root
--

CREATE TABLE public.chat_messages (
    id integer NOT NULL,
    user_id integer NOT NULL,
    channel_id integer NOT NULL,
    announcement boolean DEFAULT false NOT NULL,
    content text NOT NULL,
    "timestamp" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.chat_messages OWNER TO ft_root;

--
-- TOC entry 203 (class 1259 OID 16460)
-- Name: chat_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: ft_root
--

CREATE SEQUENCE public.chat_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.chat_messages_id_seq OWNER TO ft_root;

--
-- TOC entry 3046 (class 0 OID 0)
-- Dependencies: 203
-- Name: chat_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ft_root
--

ALTER SEQUENCE public.chat_messages_id_seq OWNED BY public.chat_messages.id;


--
-- TOC entry 204 (class 1259 OID 16462)
-- Name: friends; Type: TABLE; Schema: public; Owner: ft_root
--

CREATE TABLE public.friends (
    id integer NOT NULL,
    user_id integer NOT NULL,
    friend_id integer NOT NULL,
    status public.friends_status_enum DEFAULT 'PENDING'::public.friends_status_enum NOT NULL
);


ALTER TABLE public.friends OWNER TO ft_root;

--
-- TOC entry 205 (class 1259 OID 16466)
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
-- TOC entry 3047 (class 0 OID 0)
-- Dependencies: 205
-- Name: friends_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ft_root
--

ALTER SEQUENCE public.friends_id_seq OWNED BY public.friends.id;


--
-- TOC entry 206 (class 1259 OID 16468)
-- Name: matchs; Type: TABLE; Schema: public; Owner: ft_root
--

CREATE TABLE public.matchs (
    id integer NOT NULL,
    date timestamp without time zone DEFAULT now() NOT NULL,
    finished boolean DEFAULT false NOT NULL,
    duration integer DEFAULT 0 NOT NULL,
    type public.matchs_type_enum DEFAULT 'BOT'::public.matchs_type_enum NOT NULL,
    player1 integer DEFAULT 0 NOT NULL,
    player1_score integer DEFAULT 0 NOT NULL,
    player2 integer DEFAULT 0 NOT NULL,
    player2_score integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.matchs OWNER TO ft_root;

--
-- TOC entry 207 (class 1259 OID 16479)
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
-- TOC entry 3048 (class 0 OID 0)
-- Dependencies: 207
-- Name: matchs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ft_root
--

ALTER SEQUENCE public.matchs_id_seq OWNED BY public.matchs.id;


--
-- TOC entry 208 (class 1259 OID 16481)
-- Name: users; Type: TABLE; Schema: public; Owner: ft_root
--

CREATE TABLE public.users (
    id integer NOT NULL,
    login character varying(64) NOT NULL,
    display_name character varying(64) NOT NULL,
    email character varying(64) NOT NULL,
    role public.users_role_enum DEFAULT 'MEMBER'::public.users_role_enum NOT NULL,
    two_factor_auth boolean DEFAULT false NOT NULL,
    two_factor_auth_secret character varying(64),
    created timestamp without time zone DEFAULT now() NOT NULL,
    "lastLogin" timestamp without time zone DEFAULT now() NOT NULL,
    status public.users_status_enum DEFAULT 'OFFLINE'::public.users_status_enum NOT NULL
);


ALTER TABLE public.users OWNER TO ft_root;

--
-- TOC entry 209 (class 1259 OID 16493)
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
-- TOC entry 210 (class 1259 OID 16497)
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
-- TOC entry 3049 (class 0 OID 0)
-- Dependencies: 210
-- Name: users_achievements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ft_root
--

ALTER SEQUENCE public.users_achievements_id_seq OWNED BY public.users_achievements.id;


--
-- TOC entry 211 (class 1259 OID 16540)
-- Name: users_stats; Type: TABLE; Schema: public; Owner: ft_root
--

CREATE TABLE public.users_stats (
    id integer DEFAULT 0 NOT NULL,
    elo integer DEFAULT 1200 NOT NULL,
    played integer DEFAULT 0 NOT NULL,
    victories integer DEFAULT 0 NOT NULL,
    defeats integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.users_stats OWNER TO ft_root;

--
-- TOC entry 2839 (class 2604 OID 16499)
-- Name: achievements id; Type: DEFAULT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.achievements ALTER COLUMN id SET DEFAULT nextval('public.achievements_id_seq'::regclass);


--
-- TOC entry 2842 (class 2604 OID 16500)
-- Name: channels id; Type: DEFAULT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.channels ALTER COLUMN id SET DEFAULT nextval('public.channels_id_seq'::regclass);


--
-- TOC entry 2845 (class 2604 OID 16501)
-- Name: channels_users id; Type: DEFAULT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.channels_users ALTER COLUMN id SET DEFAULT nextval('public.channels_users_id_seq'::regclass);


--
-- TOC entry 2848 (class 2604 OID 16502)
-- Name: chat_messages id; Type: DEFAULT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.chat_messages ALTER COLUMN id SET DEFAULT nextval('public.chat_messages_id_seq'::regclass);


--
-- TOC entry 2850 (class 2604 OID 16503)
-- Name: friends id; Type: DEFAULT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.friends ALTER COLUMN id SET DEFAULT nextval('public.friends_id_seq'::regclass);


--
-- TOC entry 2859 (class 2604 OID 16504)
-- Name: matchs id; Type: DEFAULT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.matchs ALTER COLUMN id SET DEFAULT nextval('public.matchs_id_seq'::regclass);


--
-- TOC entry 2866 (class 2604 OID 16505)
-- Name: users_achievements id; Type: DEFAULT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.users_achievements ALTER COLUMN id SET DEFAULT nextval('public.users_achievements_id_seq'::regclass);


--
-- TOC entry 3021 (class 0 OID 16429)
-- Dependencies: 196
-- Data for Name: achievements; Type: TABLE DATA; Schema: public; Owner: ft_root
--

COPY public.achievements (id, name, description, points) FROM stdin;
1	Première Victoire	Vous avez gagné votre premier match. Bravo!	10
2	Dixième Victoire	Vous avez gagné votre dixième match. Bravo!	50
3	3-0\tUne victoire écrasante !	Une victoire écrasante !	100
\.


--
-- TOC entry 3023 (class 0 OID 16438)
-- Dependencies: 198
-- Data for Name: channels; Type: TABLE DATA; Schema: public; Owner: ft_root
--

COPY public.channels (id, name, password, tunnel, private, owner_id) FROM stdin;
1	public	\N	f	f	77558
2	zaap	\N	f	f	83781
3	private-eoliveir	63a9f0ea7bb98050796b649e85481845	f	t	77558
4	private-sbeaujar	63a9f0ea7bb98050796b649e85481845	f	t	83781
\.


--
-- TOC entry 3025 (class 0 OID 16445)
-- Dependencies: 200
-- Data for Name: channels_users; Type: TABLE DATA; Schema: public; Owner: ft_root
--

COPY public.channels_users (id, role, muted, channel_id, user_id) FROM stdin;
1	MODERATOR	1970-01-01 00:00:00	1	77558
2	MEMBER	1970-01-01 00:00:00	2	77558
3	MODERATOR	1970-01-01 00:00:00	1	83781
4	MEMBER	1970-01-01 00:00:00	2	83781
5	MODERATOR	1970-01-01 00:00:00	1	73316
6	MEMBER	1970-01-01 00:00:00	2	73316
7	MODERATOR	1970-01-01 00:00:00	1	77460
8	MEMBER	1970-01-01 00:00:00	2	77460
9	ADMIN	1970-01-01 00:00:00	3	77558
10	ADMIN	1970-01-01 00:00:00	4	83781
\.


--
-- TOC entry 3027 (class 0 OID 16452)
-- Dependencies: 202
-- Data for Name: chat_messages; Type: TABLE DATA; Schema: public; Owner: ft_root
--

COPY public.chat_messages (id, user_id, channel_id, announcement, content, "timestamp") FROM stdin;
1	0	1	t	sbeaujar has joined this channel!	2022-01-18 13:20:59.712637
2	0	1	t	eoliveir has joined this channel!	2022-01-18 13:20:59.712637
3	0	1	t	nbascaul has joined this channel!	2022-01-18 13:20:59.712637
4	0	1	t	jtrauque has joined this channel!	2022-01-18 13:20:59.712637
5	0	4	t	sbeaujar has joined this channel!	2022-01-18 13:20:59.712637
6	0	3	t	eoliveir has joined this channel!	2022-01-18 13:20:59.712637
7	77558	3	f	this is my private channel	2022-01-18 13:21:23.092113
8	83781	4	f	this is my private channel	2022-01-18 13:21:23.092113
9	83781	1	f	Hello World #public	2022-01-18 13:22:09.176008
10	83781	2	f	Hello World #zaap	2022-01-18 13:22:09.176008
11	77558	1	f	Hello World #public	2022-01-18 13:22:09.176008
12	77558	2	f	Hello World #zaap	2022-01-18 13:22:09.176008
13	73316	1	f	Hello this is jtrauque	2022-01-18 13:22:34.542882
14	77460	1	f	Hello this is nbascaul	2022-01-18 13:22:34.542882
15	83781	1	f	test msg	2022-01-18 22:15:40.588
16	83781	1	f	test msg	2022-01-21 10:05:41.78
17	83781	1	f	test msg2	2022-01-21 10:05:47.483
18	83781	1	f	test msg2	2022-01-21 10:05:48.881
\.


--
-- TOC entry 3029 (class 0 OID 16462)
-- Dependencies: 204
-- Data for Name: friends; Type: TABLE DATA; Schema: public; Owner: ft_root
--

COPY public.friends (id, user_id, friend_id, status) FROM stdin;
1	83781	77558	ACCEPTED
2	77558	77460	PENDING
3	83781	77460	PENDING
4	77558	73316	BLOCKED
5	83781	73316	BLOCKED
\.


--
-- TOC entry 3031 (class 0 OID 16468)
-- Dependencies: 206
-- Data for Name: matchs; Type: TABLE DATA; Schema: public; Owner: ft_root
--

COPY public.matchs (id, date, finished, duration, type, player1, player1_score, player2, player2_score) FROM stdin;
1	2022-01-18 13:27:15.290874	t	129	RANKED	83781	3	77558	0
2	2022-01-18 13:27:15.290874	t	8	RANKED	77460	2	83781	1
3	2022-01-18 13:27:15.290874	t	29	RANKED	77558	1	73316	2
4	2022-01-18 13:27:15.290874	t	257	RANKED	83781	1	73316	2
5	2022-01-18 13:27:15.290874	t	234	RANKED	73316	2	77558	1
6	2022-01-18 13:27:15.290874	t	72	RANKED	77460	0	83781	3
7	2022-01-18 13:27:15.290874	t	158	RANKED	77558	1	73316	2
8	2022-01-18 13:27:15.290874	t	160	RANKED	83781	3	77460	0
9	2022-01-18 13:27:15.290874	t	130	RANKED	77460	0	77558	3
10	2022-01-18 13:27:15.290874	t	120	RANKED	77460	1	73316	2
\.


--
-- TOC entry 3033 (class 0 OID 16481)
-- Dependencies: 208
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: ft_root
--

COPY public.users (id, login, display_name, email, role, two_factor_auth, two_factor_auth_secret, created, "lastLogin", status) FROM stdin;
77460	nbascaul	nbascaul	nbascaul@student.42.fr	MEMBER	f	\N	2022-01-18 13:29:54.639076	2022-01-18 13:29:54.639076	OFFLINE
77558	eoliveir	eoliveir	eoliveir@student.42.fr	ADMIN	f	\N	2022-01-18 13:29:54.639076	2022-01-18 13:29:54.639076	OFFLINE
73316	jtrauque	jtrauque	jtrauque@student.42.fr	MODERATOR	f	\N	2022-01-18 13:29:54.639076	2022-01-18 13:29:54.639076	OFFLINE
83781	sbeaujar	sbeaujar	sbeaujar@student.42.fr	ADMIN	f	\N	2022-01-18 13:29:54.639076	2022-01-21 10:05:35.447	OFFLINE
\.


--
-- TOC entry 3034 (class 0 OID 16493)
-- Dependencies: 209
-- Data for Name: users_achievements; Type: TABLE DATA; Schema: public; Owner: ft_root
--

COPY public.users_achievements (id, user_id, achievement_id, unlocked_at) FROM stdin;
1	77460	1	2022-01-18 13:30:27.793572
2	73316	1	2022-01-18 13:30:27.793572
3	77558	1	2022-01-18 13:30:27.793572
4	83781	1	2022-01-18 13:30:27.793572
5	77558	3	2022-01-18 13:30:27.793572
6	83781	3	2022-01-18 13:30:27.793572
\.


--
-- TOC entry 3036 (class 0 OID 16540)
-- Dependencies: 211
-- Data for Name: users_stats; Type: TABLE DATA; Schema: public; Owner: ft_root
--

COPY public.users_stats (id, elo, played, victories, defeats) FROM stdin;
77460	1205	5	1	4
77558	1205	5	2	3
73316	1230	5	5	0
83781	1210	5	2	3
\.


--
-- TOC entry 3050 (class 0 OID 0)
-- Dependencies: 197
-- Name: achievements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ft_root
--

SELECT pg_catalog.setval('public.achievements_id_seq', 3, true);


--
-- TOC entry 3051 (class 0 OID 0)
-- Dependencies: 199
-- Name: channels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ft_root
--

SELECT pg_catalog.setval('public.channels_id_seq', 4, true);


--
-- TOC entry 3052 (class 0 OID 0)
-- Dependencies: 201
-- Name: channels_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ft_root
--

SELECT pg_catalog.setval('public.channels_users_id_seq', 10, true);


--
-- TOC entry 3053 (class 0 OID 0)
-- Dependencies: 203
-- Name: chat_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ft_root
--

SELECT pg_catalog.setval('public.chat_messages_id_seq', 18, true);


--
-- TOC entry 3054 (class 0 OID 0)
-- Dependencies: 205
-- Name: friends_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ft_root
--

SELECT pg_catalog.setval('public.friends_id_seq', 5, true);


--
-- TOC entry 3055 (class 0 OID 0)
-- Dependencies: 207
-- Name: matchs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ft_root
--

SELECT pg_catalog.setval('public.matchs_id_seq', 10, true);


--
-- TOC entry 3056 (class 0 OID 0)
-- Dependencies: 210
-- Name: users_achievements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ft_root
--

SELECT pg_catalog.setval('public.users_achievements_id_seq', 6, true);


--
-- TOC entry 2885 (class 2606 OID 16507)
-- Name: matchs PK_0fdbc8e05ccfb9533008b132189; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.matchs
    ADD CONSTRAINT "PK_0fdbc8e05ccfb9533008b132189" PRIMARY KEY (id);


--
-- TOC entry 2873 (class 2606 OID 16509)
-- Name: achievements PK_1bc19c37c6249f70186f318d71d; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT "PK_1bc19c37c6249f70186f318d71d" PRIMARY KEY (id);


--
-- TOC entry 2881 (class 2606 OID 16511)
-- Name: chat_messages PK_40c55ee0e571e268b0d3cd37d10; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT "PK_40c55ee0e571e268b0d3cd37d10" PRIMARY KEY (id);


--
-- TOC entry 2899 (class 2606 OID 16549)
-- Name: users_stats PK_44924448d5896c2364a4c6ddf75; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.users_stats
    ADD CONSTRAINT "PK_44924448d5896c2364a4c6ddf75" PRIMARY KEY (id);


--
-- TOC entry 2883 (class 2606 OID 16513)
-- Name: friends PK_65e1b06a9f379ee5255054021e1; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.friends
    ADD CONSTRAINT "PK_65e1b06a9f379ee5255054021e1" PRIMARY KEY (id);


--
-- TOC entry 2897 (class 2606 OID 16515)
-- Name: users_achievements PK_914031cefc0461aedc7e259739d; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.users_achievements
    ADD CONSTRAINT "PK_914031cefc0461aedc7e259739d" PRIMARY KEY (id);


--
-- TOC entry 2887 (class 2606 OID 16517)
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- TOC entry 2879 (class 2606 OID 16519)
-- Name: channels_users PK_a44a1e76e799cf8422dd670a0f1; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.channels_users
    ADD CONSTRAINT "PK_a44a1e76e799cf8422dd670a0f1" PRIMARY KEY (id);


--
-- TOC entry 2875 (class 2606 OID 16521)
-- Name: channels PK_bc603823f3f741359c2339389f9; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.channels
    ADD CONSTRAINT "PK_bc603823f3f741359c2339389f9" PRIMARY KEY (id);


--
-- TOC entry 2889 (class 2606 OID 16523)
-- Name: users UQ_2d443082eccd5198f95f2a36e2c; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE (login);


--
-- TOC entry 2891 (class 2606 OID 16525)
-- Name: users UQ_666af67eb78f845f1ed7932f509; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_666af67eb78f845f1ed7932f509" UNIQUE (two_factor_auth_secret);


--
-- TOC entry 2893 (class 2606 OID 16527)
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- TOC entry 2895 (class 2606 OID 16529)
-- Name: users UQ_a72fa0bb46a03bedcd1745efb41; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_a72fa0bb46a03bedcd1745efb41" UNIQUE (display_name);


--
-- TOC entry 2877 (class 2606 OID 16531)
-- Name: channels UQ_d01dd8a8e614e01b6ee24664661; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.channels
    ADD CONSTRAINT "UQ_d01dd8a8e614e01b6ee24664661" UNIQUE (name);


--
-- TOC entry 3042 (class 0 OID 0)
-- Dependencies: 3
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: ft_root
--

REVOKE ALL ON SCHEMA public FROM postgres;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO ft_root;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2022-01-21 11:15:41 UTC

--
-- PostgreSQL database dump complete
--
