-- name: CreateConversation :one
INSERT INTO conversations (
  user_first_id,
  user_second_id
) VALUES (
  $1, $2
) RETURNING *;

-- name: UpdateLastMsgOfConversation :exec
UPDATE conversations
SET last_msg_created_at = $2
WHERE id = $1;

-- name: GetConverstionByID :one
SELECT * FROM conversations
WHERE id = $1
LIMIT 1;

-- name: ListConversationsOfUser :many
SELECT * FROM conversations
WHERE user_first_id = $1 OR user_second_id = $1
ORDER BY last_msg_created_at
LIMIT $2
OFFSET $3;
