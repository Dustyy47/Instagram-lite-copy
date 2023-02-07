-- name: CreatePost :one
INSERT INTO posts (
  user_id,
  title,
  description,
  image_url
) VALUES (
  $1, $2, $3, $4
) RETURNING *;

-- name: GetPostByID :one
SELECT * FROM posts
WHERE id = $1 LIMIT 1;

-- name: ListPostOfUser :many
SELECT * FROM comments
WHERE user_id = $1
ORDER BY created_at
LIMIT $2
OFFSET $3;

-- name: DeletePost :exec
DELETE FROM posts
WHERE id = $1;
