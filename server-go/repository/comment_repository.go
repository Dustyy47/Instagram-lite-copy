package repository

import (
	"context"

	"app/domain"
	"app/driverdb"
)

type commentRepository struct {
	database *driverdb.DB
	table    string
}

func NewCommentRepository(db *driverdb.DB, table string) domain.CommentRepository {
	return &commentRepository{
		database: db,
		table:    table,
	}
}

func (cr *commentRepository) Create(c context.Context, comment *domain.Comment) error {
	return nil
}

func (cr *commentRepository) GetAllPostedOnPostID(c context.Context, userID string) ([]domain.Comment, error) {
	return []domain.Comment{}, nil
}
