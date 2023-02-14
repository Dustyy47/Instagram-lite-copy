package domain

import (
	"github.com/golang-jwt/jwt/v4"
)

type JwtCustomClaims struct {
	UserID   string `json:"id"`
	NickName string `json:"nickName"`

	jwt.StandardClaims
}
