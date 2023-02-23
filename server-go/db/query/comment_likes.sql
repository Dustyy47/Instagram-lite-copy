-- name: GetLikedComment :one
SELECT * FROM comment_likes
WHERE comment_id = $1 AND user_id = $2
LIMIT 1;

-- name: LikeComment :exec
INSERT INTO comment_likes (
  comment_id,
  user_id
) VALUES (
  $1, $2
);

-- name: DislikeComment :exec
DELETE FROM comment_likes
WHERE comment_id = $1 AND user_id = $2;

-- name: GetNumLikesComment :one
SELECT COUNT(*) as count FROM comment_likes
WHERE comment_id = $1;
