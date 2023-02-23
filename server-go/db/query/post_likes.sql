-- name: GetLikedPost :one
SELECT * FROM post_likes
WHERE post_id = $1 AND user_id = $2
LIMIT 1;

-- name: LikePost :exec
INSERT INTO post_likes (
  post_id,
  user_id
) VALUES (
  $1, $2
);

-- name: DislikePost :exec
DELETE FROM post_likes
WHERE post_id = $1 AND user_id = $2;

-- name: GetNumLikesPost :one
SELECT COUNT(*) as count FROM post_likes
WHERE post_id = $1;