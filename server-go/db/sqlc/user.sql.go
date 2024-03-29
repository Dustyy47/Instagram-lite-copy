// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.17.2
// source: user.sql

package db

import (
	"context"
)

const createUser = `-- name: CreateUser :one
INSERT INTO users (
  email,
  fullname,
  hashed_password,
  nickname,
  avatar_url
) VALUES (
  $1, $2, $3, $4, $5
) RETURNING id, email, fullname, hashed_password, nickname, avatar_url
`

type CreateUserParams struct {
	Email          string `json:"email"`
	Fullname       string `json:"fullname"`
	HashedPassword string `json:"hashed_password"`
	Nickname       string `json:"nickname"`
	AvatarUrl      string `json:"avatar_url"`
}

func (q *Queries) CreateUser(ctx context.Context, arg CreateUserParams) (User, error) {
	row := q.db.QueryRowContext(ctx, createUser,
		arg.Email,
		arg.Fullname,
		arg.HashedPassword,
		arg.Nickname,
		arg.AvatarUrl,
	)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Email,
		&i.Fullname,
		&i.HashedPassword,
		&i.Nickname,
		&i.AvatarUrl,
	)
	return i, err
}

const getUserByEmail = `-- name: GetUserByEmail :one
SELECT id, email, fullname, hashed_password, nickname, avatar_url FROM users
WHERE email = $1 LIMIT 1
`

func (q *Queries) GetUserByEmail(ctx context.Context, email string) (User, error) {
	row := q.db.QueryRowContext(ctx, getUserByEmail, email)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Email,
		&i.Fullname,
		&i.HashedPassword,
		&i.Nickname,
		&i.AvatarUrl,
	)
	return i, err
}

const getUserByID = `-- name: GetUserByID :one
SELECT id, email, fullname, hashed_password, nickname, avatar_url FROM users
WHERE id = $1 LIMIT 1
`

func (q *Queries) GetUserByID(ctx context.Context, id int64) (User, error) {
	row := q.db.QueryRowContext(ctx, getUserByID, id)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Email,
		&i.Fullname,
		&i.HashedPassword,
		&i.Nickname,
		&i.AvatarUrl,
	)
	return i, err
}

const getUserByNickname = `-- name: GetUserByNickname :one
SELECT id, email, fullname, hashed_password, nickname, avatar_url FROM users
WHERE nickname = $1 LIMIT 1
`

func (q *Queries) GetUserByNickname(ctx context.Context, nickname string) (User, error) {
	row := q.db.QueryRowContext(ctx, getUserByNickname, nickname)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Email,
		&i.Fullname,
		&i.HashedPassword,
		&i.Nickname,
		&i.AvatarUrl,
	)
	return i, err
}

const updateUser = `-- name: UpdateUser :one
UPDATE users 
SET 
  email = COALESCE($2, email),
  fullname = COALESCE($3, fullname),
  nickname = COALESCE($4, nickname),
  avatar_url = COALESCE($5, avatar_url)
WHERE id = $1
RETURNING id, email, fullname, hashed_password, nickname, avatar_url
`

type UpdateUserParams struct {
	ID        int64  `json:"id"`
	Email     string `json:"email"`
	Fullname  string `json:"fullname"`
	Nickname  string `json:"nickname"`
	AvatarUrl string `json:"avatar_url"`
}

func (q *Queries) UpdateUser(ctx context.Context, arg UpdateUserParams) (User, error) {
	row := q.db.QueryRowContext(ctx, updateUser,
		arg.ID,
		arg.Email,
		arg.Fullname,
		arg.Nickname,
		arg.AvatarUrl,
	)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Email,
		&i.Fullname,
		&i.HashedPassword,
		&i.Nickname,
		&i.AvatarUrl,
	)
	return i, err
}
