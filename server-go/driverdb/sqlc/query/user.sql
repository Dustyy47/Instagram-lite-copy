-- name: CreateUser :one
INSERT INTO users (
  email,
  fullname,
  hashed_password,
  nickname,
  avatar_url
) VALUES (
  $1, $2, $3, $4, $5
) RETURNING *;

-- name: GetUserByID :one
SELECT * FROM users
WHERE id = $1 LIMIT 1;

-- name: GetUserByEmail :one
SELECT * FROM users
WHERE email = $1 LIMIT 1;

-- name: GetUserByNickname :one
SELECT * FROM users
WHERE nickname = $1 LIMIT 1;
