package domain

import (
	"context"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

const (
	CollectionUser = "users"
)

type User struct {
	ID       primitive.ObjectID `bson:"_id"`
	Email    string             `bson:"email"`
	FullName string             `bson:"fullName"`
	Password string             `bson:"password"`
	NickName string             `bson:"nickName"`

	LikedPosts    []primitive.ObjectID `bson:"likedPosts"`
	Subscribers   []primitive.ObjectID `bson:"subscribers"`
	Subscribes    []primitive.ObjectID `bson:"subscribes"`
	Conversations []primitive.ObjectID `bson:"conversations"`

	AvatarURL string `bson:"avatarUrl"`
}

type UserUsecase interface {
	Create(c context.Context, user *User) error

	GetByID(c context.Context, id string) (User, error)
	GetUserByEmail(c context.Context, email string) (User, error)
	GetUserByNickName(c context.Context, email string) (User, error)

	CreateAccessToken(user *User, secret string, expiry int) (accessToken string, err error)
}

type UserRepository interface {
	Create(c context.Context, user *User) error

	GetByID(c context.Context, id string) (User, error)
	GetByEmail(c context.Context, email string) (User, error)
	GetByNickName(c context.Context, email string) (User, error)
}
