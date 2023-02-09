CREATE TABLE comments
(
    id bigint NOT NULL DEFAULT nextval('"comments_id_seq"'::regclass),
    post_id bigint NOT NULL,
    user_id bigint NOT NULL,
    text text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamptz NOT NULL DEFAULT (now()),
    CONSTRAINT "comments_pkey" PRIMARY KEY (id)
);

CREATE TABLE comment_likes
(
    comment_id bigint NOT NULL DEFAULT nextval('"comment_likes_comment_id_seq"'::regclass),
    user_id bigint NOT NULL DEFAULT nextval('"comment_likes_user_id_seq"'::regclass),
    CONSTRAINT "comment_likes_pkey" PRIMARY KEY (comment_id)
);

CREATE TABLE conversations
(
    id bigint NOT NULL DEFAULT nextval('"conversations_id_seq"'::regclass),
    user1_id bigint NOT NULL,
    user2_id bigint NOT NULL,
    CONSTRAINT "conversations_pkey" PRIMARY KEY (id)
);

CREATE TABLE folowers
(
    user_from_id bigint NOT NULL DEFAULT nextval('"folowers_user_from_id_seq"'::regclass),
    user_to_id bigint NOT NULL DEFAULT nextval('"folowers_user_to_id_seq"'::regclass)
);

CREATE TABLE messages
(
    id bigint NOT NULL DEFAULT nextval('"messages_id_seq"'::regclass),
    conversation_id bigint NOT NULL,
    user_id bigint NOT NULL,
    text text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamptz NOT NULL DEFAULT (now()),
    CONSTRAINT "messages_pkey" PRIMARY KEY (id)
);

CREATE TABLE posts
(
    id bigint NOT NULL DEFAULT nextval('"posts_id_seq"'::regclass),
    user_id bigint NOT NULL DEFAULT nextval('"posts_user_id_seq"'::regclass),
    title character varying(255) COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    image_url text COLLATE pg_catalog."default",
    created_at timestamptz NOT NULL DEFAULT (now()),
    CONSTRAINT "posts_pkey" PRIMARY KEY (id)
);

CREATE TABLE post_likes
(
    post_id bigint NOT NULL DEFAULT nextval('"post_likes_post_id_seq"'::regclass),
    user_id bigint NOT NULL DEFAULT nextval('"post_likes_user_id_seq"'::regclass)
);

CREATE TABLE users
(
    id bigint NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    fullname character varying(50) COLLATE pg_catalog."default" NOT NULL,
    hashed_password character varying(50) COLLATE pg_catalog."default" NOT NULL,
    nickname character varying(50) COLLATE pg_catalog."default" NOT NULL,
    avatar_url text COLLATE pg_catalog."default",
    CONSTRAINT users_pkey PRIMARY KEY (id)
)