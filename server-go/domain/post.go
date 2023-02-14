package domain

import (
	"context"
	"mime/multipart"
)

const (
	CollectionPosts = "posts"
)

type Post struct {
	ID          int64  `bson:"_id"`
	Title       string `bson:"title"`
	Discription string `bson:"discription"`

	Likes    []int64 `bson:"likes"`
	PostedBy int64   `bson:"postedBy"`

	Comments []int64 `bson:"comments"`

	ImageURL string `bson:"imageUrl"`
}

type PostUsecase interface {
	Create(c context.Context, post *Post) error
	Remove(c context.Context, post *Post) error

	GetByID(c context.Context, id string) (Post, error)
	//GetByIDAndUpdate(c context.Context, filter primitive.M, update primitive.D) (Post, error)
	GetAllPostedByUser(c context.Context, userID string) ([]Post, error)
}

type PostRepository interface {
	Create(c context.Context, post *Post) error
	Remove(c context.Context, post *Post) error

	GetByID(c context.Context, id string) (Post, error)
	//GetByIDAndUpdate(c context.Context, id string, opts ...*options.UpdateOptions) (Post, error)
	//GetByIDAndUpdate(c context.Context, filter primitive.M, update primitive.D) (Post, error)

	GetAllPostedByUser(c context.Context, userID string) ([]Post, error)
}

type AddPostRequest struct {
	Title       string `form:"title" binding:"required"`
	Description string `form:"description" binding:"required"`

	Img *multipart.FileHeader `form:"img" binding:"required"`
}

type AddPostResponce Post

type DeletePostRequest struct{}

type DeletePostResponce SuccessResponse



type GetPostsByUserResponce struct {
	Posts []Post `bson:"posts"`
}
