--
-- PostgreSQL database dump
--

-- Dumped from database version 11.14
-- Dumped by pg_dump version 11.14

-- Started on 2022-01-18 21:56:15 UTC

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
-- TOC entry 645 (class 1247 OID 16553)
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
-- TOC entry 603 (class 1247 OID 16398)
-- Name: friends_status_enum; Type: TYPE; Schema: public; Owner: ft_root
--

CREATE TYPE public.friends_status_enum AS ENUM (
    'PENDING',
    'ACCEPTED',
    'BLOCKED'
);


ALTER TYPE public.friends_status_enum OWNER TO ft_root;

--
-- TOC entry 606 (class 1247 OID 16406)
-- Name: matchs_type_enum; Type: TYPE; Schema: public; Owner: ft_root
--

CREATE TYPE public.matchs_type_enum AS ENUM (
    'BOT',
    'NORMAL',
    'RANKED'
);


ALTER TYPE public.matchs_type_enum OWNER TO ft_root;

--
-- TOC entry 642 (class 1247 OID 16531)
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

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 196 (class 1259 OID 16425)
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
-- TOC entry 197 (class 1259 OID 16432)
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
-- TOC entry 3034 (class 0 OID 0)
-- Dependencies: 197
-- Name: achievements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ft_root
--

ALTER SEQUENCE public.achievements_id_seq OWNED BY public.achievements.id;


--
-- TOC entry 198 (class 1259 OID 16434)
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
-- TOC entry 199 (class 1259 OID 16439)
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
-- TOC entry 3035 (class 0 OID 0)
-- Dependencies: 199
-- Name: channels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ft_root
--

ALTER SEQUENCE public.channels_id_seq OWNED BY public.channels.id;


--
-- TOC entry 200 (class 1259 OID 16441)
-- Name: channels_users; Type: TABLE; Schema: public; Owner: ft_root
--

CREATE TABLE public.channels_users (
    id integer NOT NULL,
    role public.channels_users_role_enum DEFAULT 'MEMBER'::public.channels_users_role_enum NOT NULL,
    banned boolean DEFAULT false NOT NULL,
    muted timestamp without time zone DEFAULT now() NOT NULL,
    channel_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.channels_users OWNER TO ft_root;

--
-- TOC entry 201 (class 1259 OID 16447)
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
-- TOC entry 3036 (class 0 OID 0)
-- Dependencies: 201
-- Name: channels_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ft_root
--

ALTER SEQUENCE public.channels_users_id_seq OWNED BY public.channels_users.id;


--
-- TOC entry 202 (class 1259 OID 16449)
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
-- TOC entry 203 (class 1259 OID 16457)
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
-- TOC entry 3037 (class 0 OID 0)
-- Dependencies: 203
-- Name: chat_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ft_root
--

ALTER SEQUENCE public.chat_messages_id_seq OWNED BY public.chat_messages.id;


--
-- TOC entry 204 (class 1259 OID 16459)
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
-- TOC entry 205 (class 1259 OID 16463)
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
-- TOC entry 3038 (class 0 OID 0)
-- Dependencies: 205
-- Name: friends_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ft_root
--

ALTER SEQUENCE public.friends_id_seq OWNED BY public.friends.id;


--
-- TOC entry 206 (class 1259 OID 16465)
-- Name: matchs; Type: TABLE; Schema: public; Owner: ft_root
--

CREATE TABLE public.matchs (
    id integer NOT NULL,
    date timestamp without time zone DEFAULT now() NOT NULL,
    finished boolean DEFAULT false NOT NULL,
    duration integer DEFAULT 0 NOT NULL,
    type public.matchs_type_enum DEFAULT 'BOT'::public.matchs_type_enum NOT NULL,
    player_1_id integer DEFAULT 0 NOT NULL,
    player_1_login character varying(64) NOT NULL,
    player_1_score integer DEFAULT 0 NOT NULL,
    player_2_id integer DEFAULT 0 NOT NULL,
    player_2_login character varying(64) NOT NULL,
    player_2_score integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.matchs OWNER TO ft_root;

--
-- TOC entry 207 (class 1259 OID 16476)
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
-- TOC entry 3039 (class 0 OID 0)
-- Dependencies: 207
-- Name: matchs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ft_root
--

ALTER SEQUENCE public.matchs_id_seq OWNED BY public.matchs.id;


--
-- TOC entry 208 (class 1259 OID 16478)
-- Name: users; Type: TABLE; Schema: public; Owner: ft_root
--

CREATE TABLE public.users (
    id integer NOT NULL,
    login character varying(64) NOT NULL,
    display_name character varying(64) NOT NULL,
    email character varying(64) NOT NULL,
    role public.users_role_enum DEFAULT 'MEMBER'::public.users_role_enum NOT NULL,
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
-- TOC entry 209 (class 1259 OID 16491)
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
-- TOC entry 210 (class 1259 OID 16495)
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
-- TOC entry 3040 (class 0 OID 0)
-- Dependencies: 210
-- Name: users_achievements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ft_root
--

ALTER SEQUENCE public.users_achievements_id_seq OWNED BY public.users_achievements.id;


--
-- TOC entry 2832 (class 2604 OID 16497)
-- Name: achievements id; Type: DEFAULT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.achievements ALTER COLUMN id SET DEFAULT nextval('public.achievements_id_seq'::regclass);


--
-- TOC entry 2835 (class 2604 OID 16498)
-- Name: channels id; Type: DEFAULT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.channels ALTER COLUMN id SET DEFAULT nextval('public.channels_id_seq'::regclass);


--
-- TOC entry 2838 (class 2604 OID 16499)
-- Name: channels_users id; Type: DEFAULT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.channels_users ALTER COLUMN id SET DEFAULT nextval('public.channels_users_id_seq'::regclass);


--
-- TOC entry 2842 (class 2604 OID 16500)
-- Name: chat_messages id; Type: DEFAULT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.chat_messages ALTER COLUMN id SET DEFAULT nextval('public.chat_messages_id_seq'::regclass);


--
-- TOC entry 2844 (class 2604 OID 16501)
-- Name: friends id; Type: DEFAULT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.friends ALTER COLUMN id SET DEFAULT nextval('public.friends_id_seq'::regclass);


--
-- TOC entry 2853 (class 2604 OID 16502)
-- Name: matchs id; Type: DEFAULT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.matchs ALTER COLUMN id SET DEFAULT nextval('public.matchs_id_seq'::regclass);


--
-- TOC entry 2865 (class 2604 OID 16503)
-- Name: users_achievements id; Type: DEFAULT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.users_achievements ALTER COLUMN id SET DEFAULT nextval('public.users_achievements_id_seq'::regclass);


--
-- TOC entry 3013 (class 0 OID 16425)
-- Dependencies: 196
-- Data for Name: achievements; Type: TABLE DATA; Schema: public; Owner: ft_root
--

COPY public.achievements (id, name, description, points) FROM stdin;
1	Première Victoire	Vous avez gagné votre premier match. Bravo!	10
2	Dixième Victoire	Vous avez gagné votre dixième match. Bravo!	50
3	3-0\tUne victoire écrasante !	Une victoire écrasante !	100
\.


--
-- TOC entry 3015 (class 0 OID 16434)
-- Dependencies: 198
-- Data for Name: channels; Type: TABLE DATA; Schema: public; Owner: ft_root
--

COPY public.channels (id, name, password, tunnel, private, owner_id) FROM stdin;
1	public	\N	f	f	0
2	zaap	\N	f	f	0
3	private-eoliveir	63a9f0ea7bb98050796b649e85481845	f	t	77558
4	private-sbeaujar	63a9f0ea7bb98050796b649e85481845	f	t	83781
\.


--
-- TOC entry 3017 (class 0 OID 16441)
-- Dependencies: 200
-- Data for Name: channels_users; Type: TABLE DATA; Schema: public; Owner: ft_root
--

COPY public.channels_users (id, role, banned, muted, channel_id, user_id) FROM stdin;
1	MODERATOR	f	2022-01-18 13:19:44.94586	1	77558
2	MEMBER	f	2022-01-18 13:19:44.94586	2	77558
3	MODERATOR	f	2022-01-18 13:19:44.94586	1	83781
4	MEMBER	f	2022-01-18 13:19:44.94586	2	83781
5	MODERATOR	f	2022-01-18 13:19:44.94586	1	73316
6	MEMBER	f	2022-01-18 13:19:44.94586	2	73316
7	MODERATOR	f	2022-01-18 13:19:44.94586	1	77460
8	MEMBER	f	2022-01-18 13:19:44.94586	2	77460
9	ADMIN	f	2022-01-18 13:19:44.94586	3	77558
10	ADMIN	f	2022-01-18 13:19:44.94586	4	83781
\.


--
-- TOC entry 3019 (class 0 OID 16449)
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
\.


--
-- TOC entry 3021 (class 0 OID 16459)
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
-- TOC entry 3023 (class 0 OID 16465)
-- Dependencies: 206
-- Data for Name: matchs; Type: TABLE DATA; Schema: public; Owner: ft_root
--

COPY public.matchs (id, date, finished, duration, type, player_1_id, player_1_login, player_1_score, player_2_id, player_2_login, player_2_score) FROM stdin;
1	2022-01-18 13:27:15.290874	t	129	RANKED	83781	sbeaujar	3	77558	eoliveir	0
2	2022-01-18 13:27:15.290874	t	8	RANKED	77460	nbascaul	2	83781	sbeaujar	1
3	2022-01-18 13:27:15.290874	t	29	RANKED	77558	eoliveir	1	73316	jtrauque	2
4	2022-01-18 13:27:15.290874	t	257	RANKED	83781	sbeaujar	1	73316	jtrauque	2
5	2022-01-18 13:27:15.290874	t	234	RANKED	73316	jtrauque	2	77558	eoliveir	1
6	2022-01-18 13:27:15.290874	t	72	RANKED	77460	nbascaul	0	83781	sbeaujar	3
7	2022-01-18 13:27:15.290874	t	158	RANKED	77558	eoliveir	1	73316	jtrauque	2
8	2022-01-18 13:27:15.290874	t	160	RANKED	83781	sbeaujar	3	77460	nbascaul	0
9	2022-01-18 13:27:15.290874	t	130	RANKED	77460	nbascaul	0	77558	eoliveir	3
10	2022-01-18 13:27:15.290874	t	120	RANKED	77460	nbascaul	1	73316	jtrauque	2
\.


--
-- TOC entry 3025 (class 0 OID 16478)
-- Dependencies: 208
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: ft_root
--

COPY public.users (id, login, display_name, email, role, banned, two_factor_auth, two_factor_auth_secret, elo, played, victories, defeats, connected, created, "lastLogin") FROM stdin;
77460	nbascaul	nbascaul	nbascaul@student.42.fr	MEMBER	f	f	\N	1205	5	1	4	f	2022-01-18 13:29:54.639076	2022-01-18 13:29:54.639076
77558	eoliveir	eoliveir	eoliveir@student.42.fr	ADMIN	f	f	\N	1205	5	2	3	f	2022-01-18 13:29:54.639076	2022-01-18 13:29:54.639076
83781	sbeaujar	sbeaujar	sbeaujar@student.42.fr	ADMIN	f	f	\N	1210	5	2	3	f	2022-01-18 13:29:54.639076	2022-01-18 13:29:54.639076
73316	jtrauque	jtrauque	jtrauque@student.42.fr	MODERATOR	f	f	\N	1230	5	5	0	f	2022-01-18 13:29:54.639076	2022-01-18 13:29:54.639076
\.


--
-- TOC entry 3026 (class 0 OID 16491)
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
-- TOC entry 3041 (class 0 OID 0)
-- Dependencies: 197
-- Name: achievements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ft_root
--

SELECT pg_catalog.setval('public.achievements_id_seq', 3, true);


--
-- TOC entry 3042 (class 0 OID 0)
-- Dependencies: 199
-- Name: channels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ft_root
--

SELECT pg_catalog.setval('public.channels_id_seq', 4, true);


--
-- TOC entry 3043 (class 0 OID 0)
-- Dependencies: 201
-- Name: channels_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ft_root
--

SELECT pg_catalog.setval('public.channels_users_id_seq', 10, true);


--
-- TOC entry 3044 (class 0 OID 0)
-- Dependencies: 203
-- Name: chat_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ft_root
--

SELECT pg_catalog.setval('public.chat_messages_id_seq', 14, true);


--
-- TOC entry 3045 (class 0 OID 0)
-- Dependencies: 205
-- Name: friends_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ft_root
--

SELECT pg_catalog.setval('public.friends_id_seq', 5, true);


--
-- TOC entry 3046 (class 0 OID 0)
-- Dependencies: 207
-- Name: matchs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ft_root
--

SELECT pg_catalog.setval('public.matchs_id_seq', 10, true);


--
-- TOC entry 3047 (class 0 OID 0)
-- Dependencies: 210
-- Name: users_achievements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ft_root
--

SELECT pg_catalog.setval('public.users_achievements_id_seq', 6, true);


--
-- TOC entry 2879 (class 2606 OID 16505)
-- Name: matchs PK_0fdbc8e05ccfb9533008b132189; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.matchs
    ADD CONSTRAINT "PK_0fdbc8e05ccfb9533008b132189" PRIMARY KEY (id);


--
-- TOC entry 2867 (class 2606 OID 16507)
-- Name: achievements PK_1bc19c37c6249f70186f318d71d; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT "PK_1bc19c37c6249f70186f318d71d" PRIMARY KEY (id);


--
-- TOC entry 2875 (class 2606 OID 16509)
-- Name: chat_messages PK_40c55ee0e571e268b0d3cd37d10; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT "PK_40c55ee0e571e268b0d3cd37d10" PRIMARY KEY (id);


--
-- TOC entry 2877 (class 2606 OID 16511)
-- Name: friends PK_65e1b06a9f379ee5255054021e1; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.friends
    ADD CONSTRAINT "PK_65e1b06a9f379ee5255054021e1" PRIMARY KEY (id);


--
-- TOC entry 2891 (class 2606 OID 16513)
-- Name: users_achievements PK_914031cefc0461aedc7e259739d; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.users_achievements
    ADD CONSTRAINT "PK_914031cefc0461aedc7e259739d" PRIMARY KEY (id);


--
-- TOC entry 2881 (class 2606 OID 16515)
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- TOC entry 2873 (class 2606 OID 16517)
-- Name: channels_users PK_a44a1e76e799cf8422dd670a0f1; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.channels_users
    ADD CONSTRAINT "PK_a44a1e76e799cf8422dd670a0f1" PRIMARY KEY (id);


--
-- TOC entry 2869 (class 2606 OID 16519)
-- Name: channels PK_bc603823f3f741359c2339389f9; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.channels
    ADD CONSTRAINT "PK_bc603823f3f741359c2339389f9" PRIMARY KEY (id);


--
-- TOC entry 2883 (class 2606 OID 16521)
-- Name: users UQ_2d443082eccd5198f95f2a36e2c; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE (login);


--
-- TOC entry 2885 (class 2606 OID 16523)
-- Name: users UQ_666af67eb78f845f1ed7932f509; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_666af67eb78f845f1ed7932f509" UNIQUE (two_factor_auth_secret);


--
-- TOC entry 2887 (class 2606 OID 16525)
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- TOC entry 2889 (class 2606 OID 16527)
-- Name: users UQ_a72fa0bb46a03bedcd1745efb41; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_a72fa0bb46a03bedcd1745efb41" UNIQUE (display_name);


--
-- TOC entry 2871 (class 2606 OID 16529)
-- Name: channels UQ_d01dd8a8e614e01b6ee24664661; Type: CONSTRAINT; Schema: public; Owner: ft_root
--

ALTER TABLE ONLY public.channels
    ADD CONSTRAINT "UQ_d01dd8a8e614e01b6ee24664661" UNIQUE (name);


--
-- TOC entry 3033 (class 0 OID 0)
-- Dependencies: 3
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: ft_root
--

REVOKE ALL ON SCHEMA public FROM postgres;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO ft_root;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2022-01-18 21:56:15 UTC

--
-- PostgreSQL database dump complete
--
