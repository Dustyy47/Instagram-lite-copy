package usecase

import (
	"context"
	"time"

	"github.com/Dustyy47/Instagram-lite-copy/server-go/domain"
	"github.com/Dustyy47/Instagram-lite-copy/server-go/internal/tokenutil"
)

type registerUsecase struct {
	userRepository domain.UserRepository
	contextTimeout time.Duration
}

func NewRegisterUsecase(userRepository domain.UserRepository, timeout time.Duration) domain.RegisterUsecase {
	return &registerUsecase{
		userRepository: userRepository,
		contextTimeout: timeout,
	}
}

func (su *registerUsecase) Create(c context.Context, user *domain.User) error {
	ctx, cancel := context.WithTimeout(c, su.contextTimeout)
	defer cancel()
	return su.userRepository.Create(ctx, user)
}

func (su *registerUsecase) GetUserByEmail(c context.Context, email string) (domain.User, error) {
	ctx, cancel := context.WithTimeout(c, su.contextTimeout)
	defer cancel()
	return su.userRepository.GetByEmail(ctx, email)
}

func (su *registerUsecase) CreateAccessToken(user *domain.User, secret string, expiry int) (accessToken string, err error) {
	return tokenutil.CreateAccessToken(user, secret, expiry)
}
