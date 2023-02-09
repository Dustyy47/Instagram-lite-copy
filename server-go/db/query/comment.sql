-- name: CreateComment :one
INSERT INTO comments (
  post_id,
  user_id,
  text,
  created_at
) VALUES (
  $1, $2, $3, $4
) RETURNING *;


-- name: ListCommentsOfPost :many
SELECT * FROM comments
WHERE post_id = $1
ORDER BY created_at
LIMIT $2
OFFSET $3;
