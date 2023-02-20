package db

import (
	"context"
	"database/sql"
)

type Store interface {
	Querier
	FindUsersByNickname(ctx context.Context, arg FindUsersByNicknameParams) ([]User, error)
}

func NewStore(db *sql.DB) Store {
	return New(db)
}
