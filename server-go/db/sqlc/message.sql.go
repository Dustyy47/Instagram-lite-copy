// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.17.2
// source: message.sql

package db

import (
	"context"
)

const createMessage = `-- name: CreateMessage :one
INSERT INTO messages (
  conversation_id,
  user_id,
  text
) VALUES (
  $1, $2, $3
) RETURNING id, conversation_id, user_id, text, created_at
`

type CreateMessageParams struct {
	ConversationID int64  `json:"conversation_id"`
	UserID         int64  `json:"user_id"`
	Text           string `json:"text"`
}

func (q *Queries) CreateMessage(ctx context.Context, arg CreateMessageParams) (Message, error) {
	row := q.db.QueryRowContext(ctx, createMessage, arg.ConversationID, arg.UserID, arg.Text)
	var i Message
	err := row.Scan(
		&i.ID,
		&i.ConversationID,
		&i.UserID,
		&i.Text,
		&i.CreatedAt,
	)
	return i, err
}

const listMessgesOfConversation = `-- name: ListMessgesOfConversation :many
SELECT id, conversation_id, user_id, text, created_at FROM messages
WHERE conversation_id = $1
ORDER BY last_msg_created_at
LIMIT $2
OFFSET $3
`

type ListMessgesOfConversationParams struct {
	ConversationID int64 `json:"conversation_id"`
	Limit          int32 `json:"limit"`
	Offset         int32 `json:"offset"`
}

func (q *Queries) ListMessgesOfConversation(ctx context.Context, arg ListMessgesOfConversationParams) ([]Message, error) {
	rows, err := q.db.QueryContext(ctx, listMessgesOfConversation, arg.ConversationID, arg.Limit, arg.Offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Message
	for rows.Next() {
		var i Message
		if err := rows.Scan(
			&i.ID,
			&i.ConversationID,
			&i.UserID,
			&i.Text,
			&i.CreatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}
