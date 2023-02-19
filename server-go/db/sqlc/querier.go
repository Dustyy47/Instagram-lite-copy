// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.16.0

package db

import (
	"context"
)

type Querier interface {
	CreateComment(ctx context.Context, arg CreateCommentParams) (Comment, error)
	CreateConversation(ctx context.Context, arg CreateConversationParams) (Conversation, error)
	CreateFollower(ctx context.Context, arg CreateFollowerParams) (Follower, error)
	CreateMessage(ctx context.Context, arg CreateMessageParams) (Message, error)
	CreatePost(ctx context.Context, arg CreatePostParams) (Post, error)
	CreateUser(ctx context.Context, arg CreateUserParams) (User, error)
	DeleteComment(ctx context.Context, id int64) error
	DeleteFollower(ctx context.Context, arg DeleteFollowerParams) error
	DeletePost(ctx context.Context, id int64) error
	DislikeComment(ctx context.Context, arg DislikeCommentParams) error
	DislikePost(ctx context.Context, arg DislikePostParams) error
	GetCommentByID(ctx context.Context, id int64) (Comment, error)
	GetConverstionByID(ctx context.Context, id int64) (Conversation, error)
	GetFollower(ctx context.Context, arg GetFollowerParams) (Follower, error)
	GetLikedComment(ctx context.Context, arg GetLikedCommentParams) (CommentLike, error)
	GetLikedPost(ctx context.Context, arg GetLikedPostParams) (PostLike, error)
	GetNumFollowers(ctx context.Context, userToID int64) (int64, error)
	GetNumFollowing(ctx context.Context, userFromID int64) (int64, error)
	GetNumLikesComment(ctx context.Context) (int64, error)
	GetNumLikesPost(ctx context.Context) (int64, error)
	GetPostByID(ctx context.Context, id int64) (Post, error)
	GetUserByEmail(ctx context.Context, email string) (User, error)
	GetUserByID(ctx context.Context, id int64) (User, error)
	GetUserByNickname(ctx context.Context, nickname string) (User, error)
	LikeComment(ctx context.Context, arg LikeCommentParams) error
	LikePost(ctx context.Context, arg LikePostParams) error
	ListCommentsOfPost(ctx context.Context, arg ListCommentsOfPostParams) ([]Comment, error)
	ListConversationsOfUser(ctx context.Context, arg ListConversationsOfUserParams) ([]Conversation, error)
	ListFollowerOfUser(ctx context.Context, arg ListFollowerOfUserParams) ([]Follower, error)
	ListFollowingOfUser(ctx context.Context, arg ListFollowingOfUserParams) ([]Follower, error)
	ListMessgesOfConversation(ctx context.Context, arg ListMessgesOfConversationParams) ([]Message, error)
	ListPostOfUser(ctx context.Context, arg ListPostOfUserParams) ([]Post, error)
	UpdateLastMsgOfConversation(ctx context.Context, arg UpdateLastMsgOfConversationParams) error
	UpdateUser(ctx context.Context, arg UpdateUserParams) (User, error)
}

var _ Querier = (*Queries)(nil)
