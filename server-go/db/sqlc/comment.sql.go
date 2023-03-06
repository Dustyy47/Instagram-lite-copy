// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.17.2
// source: comment.sql

package db

import (
	"context"
)

const createComment = `-- name: CreateComment :one
INSERT INTO comments (
  post_id,
  user_id,
  text
) VALUES (
  $1, $2, $3
) RETURNING id, post_id, user_id, text, created_at
`

type CreateCommentParams struct {
	PostID int64  `json:"post_id"`
	UserID int64  `json:"user_id"`
	Text   string `json:"text"`
}

func (q *Queries) CreateComment(ctx context.Context, arg CreateCommentParams) (Comment, error) {
	row := q.db.QueryRowContext(ctx, createComment, arg.PostID, arg.UserID, arg.Text)
	var i Comment
	err := row.Scan(
		&i.ID,
		&i.PostID,
		&i.UserID,
		&i.Text,
		&i.CreatedAt,
	)
	return i, err
}

const deleteComment = `-- name: DeleteComment :exec
DELETE FROM comments
WHERE id = $1
`

func (q *Queries) DeleteComment(ctx context.Context, id int64) error {
	_, err := q.db.ExecContext(ctx, deleteComment, id)
	return err
}

const deleteCommentsByPostID = `-- name: DeleteCommentsByPostID :exec
DELETE FROM comments
where post_id = $1
`

func (q *Queries) DeleteCommentsByPostID(ctx context.Context, postID int64) error {
	_, err := q.db.ExecContext(ctx, deleteCommentsByPostID, postID)
	return err
}

const getCommentByID = `-- name: GetCommentByID :one
SELECT id, post_id, user_id, text, created_at FROM comments
WHERE id = $1
LIMIT 1
`

func (q *Queries) GetCommentByID(ctx context.Context, id int64) (Comment, error) {
	row := q.db.QueryRowContext(ctx, getCommentByID, id)
	var i Comment
	err := row.Scan(
		&i.ID,
		&i.PostID,
		&i.UserID,
		&i.Text,
		&i.CreatedAt,
	)
	return i, err
}

const listCommentsOfPost = `-- name: ListCommentsOfPost :many
SELECT id, post_id, user_id, text, created_at FROM comments
WHERE post_id = $1
ORDER BY created_at
LIMIT $2
OFFSET $3
`

type ListCommentsOfPostParams struct {
	PostID int64 `json:"post_id"`
	Limit  int32 `json:"limit"`
	Offset int32 `json:"offset"`
}

func (q *Queries) ListCommentsOfPost(ctx context.Context, arg ListCommentsOfPostParams) ([]Comment, error) {
	rows, err := q.db.QueryContext(ctx, listCommentsOfPost, arg.PostID, arg.Limit, arg.Offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Comment
	for rows.Next() {
		var i Comment
		if err := rows.Scan(
			&i.ID,
			&i.PostID,
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
