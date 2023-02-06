package domain

import (
	"context"
	"time"
)

const (
	CollectionComments = "comments"
)

type Comment struct {
	ID     int64  `bson:"_id"`
	Text   string `bson:"text"`
	Author int64  `bson:"author"`
	PostID int64  `bson:"post"`

	CreatedAt time.Time `bson:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt"`
}

type CommentUsecase interface {
	Create(c context.Context, comment *Comment) error
	GetAllPostedOnPostID(c context.Context, postID string) ([]Comment, error)
}

type CommentRepository interface {
	Create(c context.Context, comment *Comment) error
	GetAllPostedOnPostID(c context.Context, postID string) ([]Comment, error)
}

type AddCommentRequest struct {
	Text string `form:"text" binding:"required"`
}

type AddCommentResponce Comment

type GetCommentsByPostIDResponce struct {
	Comments []Comment `bson:"comments"`
}
