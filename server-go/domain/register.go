package domain

import (
	"context"
)

type RegisterRequest struct {
	Email    string `form:"email" binding:"required,email"`
	Password string `form:"password" binding:"required"`
	FullName string `form:"fullName" binding:"required"`
	NickName string `form:"nickName" binding:"required"`
}

type RegisterResponse struct {
	AccessToken string `json:"accessToken"`
}

type RegisterUsecase interface {
	Create(c context.Context, user *User) error
	GetUserByEmail(c context.Context, email string) (User, error)
	CreateAccessToken(user *User, secret string, expiry int) (accessToken string, err error)
}
