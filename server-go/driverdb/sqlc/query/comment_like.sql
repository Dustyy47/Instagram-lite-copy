-- name: CreateCommentLike :one
INSERT INTO comment_likes (
  comment_id,
  user_id,
) VALUES (
  $1, $2
) RETURNING *;


-- name: ListCommentLikes :many
SELECT * FROM comments
WHERE comment_id = $1
LIMIT $2
OFFSET $3;
