-- name: CreateComment :one
INSERT INTO comments (
  post_id,
  user_id,
  text
) VALUES (
  $1, $2, $3
) RETURNING *;

-- name: GetCommentByID :one
SELECT * FROM comments
WHERE id = $1
LIMIT 1;

-- name: ListCommentsOfPost :many
SELECT * FROM comments
WHERE post_id = $1
ORDER BY created_at
LIMIT $2
OFFSET $3;

-- name: DeleteComment :exec
DELETE FROM comments
WHERE id = $1;
