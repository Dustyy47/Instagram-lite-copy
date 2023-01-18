package domain

import (
	"mime/multipart"
)

type LoginRequest struct {
	Email    string `form:"email" binding:"required,email"`
	Password string `form:"password" binding:"required"`
}

type RegisterRequest struct {
	Email    string `form:"email" binding:"required,email"`
	Password string `form:"password" binding:"required"`
	FullName string `form:"fullName" binding:"required"`
	NickName string `form:"nickName" binding:"required"`

	AvatarImage *multipart.FileHeader `form:"avatarImage" binding:"required"`
}

type AuthResponse struct {
	AccessToken string `json:"accessToken"`
}
