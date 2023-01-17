package usecase

import (
	"context"
	"time"

	"github.com/Dustyy47/Instagram-lite-copy/server-go/domain"
	"github.com/Dustyy47/Instagram-lite-copy/server-go/internal/tokenutil"
)

type authUsecase struct {
	userRepository domain.UserRepository
	contextTimeout time.Duration
}

func NewAuthUsecase(userRepository domain.UserRepository, timeout time.Duration) domain.AuthUsecase {
	return &authUsecase{
		userRepository: userRepository,
		contextTimeout: timeout,
	}
}

func (au *authUsecase) Create(c context.Context, user *domain.User) error {
	ctx, cancel := context.WithTimeout(c, au.contextTimeout)
	defer cancel()
	return au.userRepository.Create(ctx, user)
}

func (au *authUsecase) GetUserByEmail(c context.Context, email string) (domain.User, error) {
	ctx, cancel := context.WithTimeout(c, au.contextTimeout)
	defer cancel()
	return au.userRepository.GetByEmail(ctx, email)
}

func (au *authUsecase) CreateAccessToken(user *domain.User, secret string, expiry int) (accessToken string, err error) {
	return tokenutil.CreateAccessToken(user, secret, expiry)
}
