package usecase

import (
	"context"
	"time"

	"github.com/Dustyy47/Instagram-lite-copy/server-go/domain"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type postUsecase struct {
	postRepository domain.PostRepository
	contextTimeout time.Duration
}

func NewPostUsecase(postRepository domain.PostRepository, timeout time.Duration) domain.PostUsecase {
	return &postUsecase{
		postRepository: postRepository,
		contextTimeout: timeout,
	}
}

func (pu *postUsecase) Create(c context.Context, post *domain.Post) error {
	ctx, cancel := context.WithTimeout(c, pu.contextTimeout)
	defer cancel()
	return pu.postRepository.Create(ctx, post)
}

func (pu *postUsecase) Remove(c context.Context, post *domain.Post) error {
	ctx, cancel := context.WithTimeout(c, pu.contextTimeout)
	defer cancel()
	return pu.postRepository.Remove(ctx, post)
}

func (pu *postUsecase) GetByID(c context.Context, id string) (domain.Post, error) {
	ctx, cancel := context.WithTimeout(c, pu.contextTimeout)
	defer cancel()
	return pu.postRepository.GetByID(ctx, id)
}

func (pu *postUsecase) GetByIDAndUpdate(c context.Context, filter primitive.M, command primitive.D) (domain.Post, error) {
	ctx, cancel := context.WithTimeout(c, pu.contextTimeout)
	defer cancel()
	return pu.postRepository.GetByIDAndUpdate(ctx, filter, command)
}

func (pu *postUsecase) GetAllPostedByUser(c context.Context, userID string) ([]domain.Post, error) {
	ctx, cancel := context.WithTimeout(c, pu.contextTimeout)
	defer cancel()
	return pu.postRepository.GetAllPostedByUser(ctx, userID)
}
