-- name: CreateFollower :one
INSERT INTO followers (
  user_from_id,
  user_to_id
) VALUES (
  $1, $2
) RETURNING *;

-- name: GetFollower :one
SELECT * FROM followers
WHERE user_from_id = $1 AND user_to_id = $2;
  
-- name: GetNumFollowers :one
SELECT COUNT(*) as count FROM followers
WHERE user_to_id = $1;

-- name: GetNumFollowing :one
SELECT COUNT(*) as count FROM followers
WHERE user_from_id = $1;

-- name: ListFollowerOfUser :many
SELECT * FROM followers
WHERE user_to_id = $1
LIMIT $2
OFFSET $3;

-- name: ListFollowingOfUser :many
SELECT * FROM followers
WHERE user_from_id = $1
LIMIT $2
OFFSET $3;

-- name: DeleteFollower :exec
DELETE FROM followers
WHERE user_from_id = $1 AND user_to_id = $2;
