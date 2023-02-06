package usecase

import (
	"context"
	"time"

	"app/domain"
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

func (pu *postUsecase) GetByIDAndUpdate(c context.Context) (domain.Post, error) {
	// ctx, cancel := context.WithTimeout(c, pu.contextTimeout)
	// defer cancel()
	// return pu.postRepository.GetByIDAndUpdate(ctx, filter, command)
	return domain.Post{}, nil
}

func (pu *postUsecase) GetAllPostedByUser(c context.Context, userID string) ([]domain.Post, error) {
	ctx, cancel := context.WithTimeout(c, pu.contextTimeout)
	defer cancel()
	return pu.postRepository.GetAllPostedByUser(ctx, userID)
}
