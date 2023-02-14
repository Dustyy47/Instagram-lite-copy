package db

import (
	"database/sql"
)

type Store interface {
	Querier
}

func NewStore(db *sql.DB) Store {
	return New(db)
}
