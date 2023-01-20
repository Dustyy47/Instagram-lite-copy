package domain

import (
	"context"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

const (
	CollectionComments = "comments"
)

type Comment struct {
	ID     primitive.ObjectID `bson:"_id"`
	Text   string             `bson:"text"`
	Author primitive.ObjectID `bson:"author"`
	PostID primitive.ObjectID `bson:"post"`

	CreatedAt primitive.Timestamp `bson:"createdAt"`
	UpdatedAt primitive.Timestamp `bson:"updatedAt"`
}

type CommentUsecase interface {
	Create(c context.Context, comment *Comment) (primitive.ObjectID, error)
	GetAllPostedOnPostID(c context.Context, postID string) ([]Comment, error)
}

type CommentRepository interface {
	Create(c context.Context, comment *Comment) (primitive.ObjectID, error)
	GetAllPostedOnPostID(c context.Context, postID string) ([]Comment, error)
}

type AddCommentRequest struct {
	Text string `form:"text" binding:"required"`
}

type AddCommentResponce Comment

type GetCommentsByPostIDResponce struct {
	Comments []Comment `bson:"comments"`
}
