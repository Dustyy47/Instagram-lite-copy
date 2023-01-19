package domain

import (
	"context"
	"mime/multipart"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const (
	CollectionPosts = "posts"
)

type Post struct {
	ID          primitive.ObjectID `bson:"_id"`
	Title       string             `bson:"title"`
	Discription string             `bson:"discription"`

	Likes    []primitive.ObjectID `bson:"likes"`
	PostedBy primitive.ObjectID   `bson:"postedBy"`

	Comments []primitive.ObjectID `bson:"comments"`

	ImageURL string `bson:"imageUrl"`
}

type PostUsecase interface {
	Create(c context.Context, post *Post) error
	Remove(c context.Context, post *Post) error

	GetByID(c context.Context, id string) (Post, error)
	GetByIDAndUpdate(c context.Context, id string, opts ...*options.UpdateOptions) (Post, error)
}

type PostRepository interface {
	Create(c context.Context, post *Post) error
	Remove(c context.Context, post *Post) error

	GetByID(c context.Context, id string) (Post, error)
	GetByIDAndUpdate(c context.Context, id string, opts ...*options.UpdateOptions) (Post, error)
}

type AddPostRequest struct {
	Title       string `form:"title" binding:"required"`
	Description string `form:"description" binding:"required"`

	Img *multipart.FileHeader `form:"img" binding:"required"`
}

type AddPostResponce Post

type DeletePostRequest struct {
}

type DeletePostResponce SuccessResponse
