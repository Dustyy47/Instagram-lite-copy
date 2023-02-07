
CREATE TABLE Comment_Like
(
    comment_id bigint NOT NULL DEFAULT nextval('"Comment_Like_comment_id_seq"'::regclass),
    user_id bigint NOT NULL DEFAULT nextval('"Comment_Like_user_id_seq"'::regclass),
    CONSTRAINT "Comment_Like_pkey" PRIMARY KEY (comment_id)
)

CREATE TABLE Conversation
(
    id bigint NOT NULL DEFAULT nextval('"Conversation_id_seq"'::regclass),
    user1_id bigint NOT NULL,
    user2_id bigint NOT NULL,
    CONSTRAINT "Conversation_pkey" PRIMARY KEY (id)
)

CREATE TABLE Folower
(
    user_from_id bigint NOT NULL DEFAULT nextval('"Folower_user_from_id_seq"'::regclass),
    user_to_id bigint NOT NULL DEFAULT nextval('"Folower_user_to_id_seq"'::regclass)
)

CREATE TABLE Message
(
    id bigint NOT NULL DEFAULT nextval('"Message_id_seq"'::regclass),
    conversation_id bigint NOT NULL,
    user_id bigint NOT NULL,
    text text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL,
    CONSTRAINT "Message_pkey" PRIMARY KEY (id)
)

CREATE TABLE Post
(
    id bigint NOT NULL DEFAULT nextval('"Post_id_seq"'::regclass),
    user_id bigint NOT NULL DEFAULT nextval('"Post_user_id_seq"'::regclass),
    title character varying(255) COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    image_url text COLLATE pg_catalog."default",
    created_at timestamp with time zone NOT NULL,
    CONSTRAINT "Post_pkey" PRIMARY KEY (id)
)

CREATE TABLE Post_Like
(
    post_id bigint NOT NULL DEFAULT nextval('"Post_Like_post_id_seq"'::regclass),
    user_id bigint NOT NULL DEFAULT nextval('"Post_Like_user_id_seq"'::regclass)
)

CREATE TABLE User
(
    id bigint NOT NULL DEFAULT nextval('"User_id_seq"'::regclass),
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    fullname character varying(50) COLLATE pg_catalog."default" NOT NULL,
    password character varying(25) COLLATE pg_catalog."default" NOT NULL,
    nickname character varying(50) COLLATE pg_catalog."default" NOT NULL,
    avatar_url text COLLATE pg_catalog."default",
    CONSTRAINT "User_pkey" PRIMARY KEY (id)
)

created_at timestamp with time zone NOT NULL,