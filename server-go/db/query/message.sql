-- name: CreateMessage :one
INSERT INTO messages (
  conversation_id,
  user_id,
  text
) VALUES (
  $1, $2, $3
) RETURNING *;

-- name: ListMessgesOfConversation :many
SELECT * FROM messages
WHERE conversation_id = $1
ORDER BY last_msg_created_at
LIMIT $2
OFFSET $3;
