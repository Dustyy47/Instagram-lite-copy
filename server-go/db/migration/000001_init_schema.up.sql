CREATE TABLE "users" (
  "id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "email" varchar NOT NULL,
  "fullname" varchar NOT NULL,
  "hashed_password" varchar NOT NULL,
  "nickname" varchar NOT NULL,
  "avatar_url" varchar NOT NULL
);

CREATE TABLE "posts" (
  "id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "user_id" BIGINT NOT NULL,
  "title" varchar NOT NULL,
  "description" varchar NOT NULL,
  "image_url" varchar NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "comments" (
  "id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "post_id" bigint NOT NULL,
  "user_id" bigint NOT NULL,
  "text" varchar NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "conversations" (
  "id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "user_first_id" bigint NOT NULL,
  "user_second_id" bigint NOT NULL,
  "last_msg_created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "messages" (
  "id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "conversation_id" bigint NOT NULL,
  "user_id" bigint NOT NULL,
  "text" varchar NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "comment_likes" (
  "comment_id" bigint NOT NULL,
  "user_id" bigint NOT NULL
);

CREATE TABLE "post_likes" (
  "post_id" bigint NOT NULL,
  "user_id" bigint NOT NULL
);

CREATE TABLE "followers" (
  "user_from_id" bigint NOT NULL,
  "user_to_id" bigint NOT NULL
);

CREATE INDEX ON "users" ("id");

CREATE INDEX ON "users" ("email");

CREATE INDEX ON "users" ("nickname");

CREATE INDEX ON "posts" ("id");

CREATE INDEX ON "posts" ("user_id");

CREATE INDEX ON "comments" ("post_id");

CREATE INDEX ON "conversations" ("user_first_id");

CREATE INDEX ON "conversations" ("user_second_id");

CREATE INDEX ON "conversations" ("user_first_id", "user_second_id");

CREATE INDEX ON "messages" ("conversation_id");

CREATE INDEX ON "messages" ("conversation_id", "user_id");

CREATE INDEX ON "comment_likes" ("comment_id", "user_id");

CREATE INDEX ON "post_likes" ("post_id", "user_id");

CREATE INDEX ON "followers" ("user_from_id");

CREATE INDEX ON "followers" ("user_to_id");

CREATE INDEX ON "followers" ("user_from_id", "user_to_id");

ALTER TABLE "posts" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "comments" ADD FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON DELETE CASCADE;

ALTER TABLE "comments" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "conversations" ADD FOREIGN KEY ("user_first_id") REFERENCES "users" ("id");

ALTER TABLE "conversations" ADD FOREIGN KEY ("user_second_id") REFERENCES "users" ("id");

ALTER TABLE "messages" ADD FOREIGN KEY ("conversation_id") REFERENCES "conversations" ("id");

ALTER TABLE "messages" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "comment_likes" ADD FOREIGN KEY ("comment_id") REFERENCES "comments" ("id") ON DELETE CASCADE;

ALTER TABLE "comment_likes" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "post_likes" ADD FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON DELETE CASCADE;

ALTER TABLE "post_likes" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "followers" ADD FOREIGN KEY ("user_from_id") REFERENCES "users" ("id");

ALTER TABLE "followers" ADD FOREIGN KEY ("user_to_id") REFERENCES "users" ("id");
