// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.16.0

package db

import (
	"context"
)

type Querier interface {
	CreateComment(ctx context.Context, arg CreateCommentParams) (Comment, error)
	CreatePost(ctx context.Context, arg CreatePostParams) (Post, error)
	CreateUser(ctx context.Context, arg CreateUserParams) (User, error)
	DeletePost(ctx context.Context, id int64) error
	GetPostByID(ctx context.Context, id int64) (Post, error)
	GetUserByEmail(ctx context.Context, email string) (User, error)
	GetUserByID(ctx context.Context, id int64) (User, error)
	GetUserByNickname(ctx context.Context, nickname string) (User, error)
	ListCommentsOfPost(ctx context.Context, arg ListCommentsOfPostParams) ([]Comment, error)
	ListPostOfUser(ctx context.Context, arg ListPostOfUserParams) ([]Comment, error)
}

var _ Querier = (*Queries)(nil)
