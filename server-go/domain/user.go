package domain

import (
	"context"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

const (
	CollectionUser = "users"
)

type User struct {
	ID            primitive.ObjectID   `bson:"_id"`
	Email         string               `bson:"email"`
	FullName      string               `bson:"fullName"`
	Password      string               `bson:"password"`
	NickName      string               `bson:"nickName"`
	LikedPosts    []primitive.ObjectID `bson:"likedPosts"`
	Subscribers   []primitive.ObjectID `bson:"subscribers"`
	Conversations []primitive.ObjectID `bson:"conversations"`
	AvatarUrl     string               `bson:"avatarUrl"`
}

type UserRepository interface {
	Create(c context.Context, user *User) error
	//Fetch(c context.Context) ([]User, error)
	GetByEmail(c context.Context, email string) (User, error)
	GetByID(c context.Context, id string) (User, error)
}
