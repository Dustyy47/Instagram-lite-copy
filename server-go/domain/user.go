package domain

import (
	"context"
)

const (
	CollectionUser = "users"
)

type User struct {
	ID       int64  `bson:"_id"`
	Email    string `bson:"email"`
	FullName string `bson:"fullName"`
	Password string `bson:"password"`
	NickName string `bson:"nickName"`

	LikedPosts    []int64 `bson:"likedPosts"`
	Subscribers   []int64 `bson:"subscribers"`
	Subscribes    []int64 `bson:"subscribes"`
	Conversations []int64 `bson:"conversations"`

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
