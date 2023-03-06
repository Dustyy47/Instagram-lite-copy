// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.17.2
// source: post.sql

package db

import (
	"context"
)

const createPost = `-- name: CreatePost :one
INSERT INTO posts (
  user_id,
  title,
  description,
  image_url
) VALUES (
  $1, $2, $3, $4
) RETURNING id, user_id, title, description, image_url, created_at
`

type CreatePostParams struct {
	UserID      int64  `json:"user_id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	ImageUrl    string `json:"image_url"`
}

func (q *Queries) CreatePost(ctx context.Context, arg CreatePostParams) (Post, error) {
	row := q.db.QueryRowContext(ctx, createPost,
		arg.UserID,
		arg.Title,
		arg.Description,
		arg.ImageUrl,
	)
	var i Post
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.Title,
		&i.Description,
		&i.ImageUrl,
		&i.CreatedAt,
	)
	return i, err
}

const deletePost = `-- name: DeletePost :exec
DELETE FROM posts
WHERE id = $1
`

func (q *Queries) DeletePost(ctx context.Context, id int64) error {
	_, err := q.db.ExecContext(ctx, deletePost, id)
	return err
}

const getPostByID = `-- name: GetPostByID :one
SELECT id, user_id, title, description, image_url, created_at FROM posts
WHERE id = $1 LIMIT 1
`

func (q *Queries) GetPostByID(ctx context.Context, id int64) (Post, error) {
	row := q.db.QueryRowContext(ctx, getPostByID, id)
	var i Post
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.Title,
		&i.Description,
		&i.ImageUrl,
		&i.CreatedAt,
	)
	return i, err
}

const listPostOfUser = `-- name: ListPostOfUser :many
SELECT id, user_id, title, description, image_url, created_at FROM posts
WHERE user_id = $1
ORDER BY created_at
LIMIT $2
OFFSET $3
`

type ListPostOfUserParams struct {
	UserID int64 `json:"user_id"`
	Limit  int32 `json:"limit"`
	Offset int32 `json:"offset"`
}

func (q *Queries) ListPostOfUser(ctx context.Context, arg ListPostOfUserParams) ([]Post, error) {
	rows, err := q.db.QueryContext(ctx, listPostOfUser, arg.UserID, arg.Limit, arg.Offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Post
	for rows.Next() {
		var i Post
		if err := rows.Scan(
			&i.ID,
			&i.UserID,
			&i.Title,
			&i.Description,
			&i.ImageUrl,
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
