package usecase

import (
	"context"
	"time"

	"app/domain"
)

type commentUsecase struct {
	commentRepository domain.CommentRepository
	contextTimeout    time.Duration
}

func NewCommentUsecase(commentRepository domain.CommentRepository, timeout time.Duration) domain.CommentUsecase {
	return &commentUsecase{
		commentRepository: commentRepository,
		contextTimeout:    timeout,
	}
}

func (cu *commentUsecase) Create(c context.Context, comment *domain.Comment) error {
	ctx, cancel := context.WithTimeout(c, cu.contextTimeout)
	defer cancel()
	return cu.commentRepository.Create(ctx, comment)
}

func (cu *commentUsecase) GetAllPostedOnPostID(c context.Context, postID string) ([]domain.Comment, error) {
	// ctx, cancel := context.WithTimeout(c, cu.contextTimeout)
	// defer cancel()
	// return cu.commentRepository.GetAllPostedOnPostID(ctx, postID)
	return []domain.Comment{}, nil
}
