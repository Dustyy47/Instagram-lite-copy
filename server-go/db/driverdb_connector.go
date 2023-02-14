package db

import (
	"database/sql"

	_ "github.com/lib/pq"
)

func Connect(dbDriver, dbSource string) (*sql.DB, error) {
	conn, err := sql.Open(dbDriver, dbSource)
	if err != nil {
		return conn, err
	}

	err = conn.Ping()
	return conn, err
}
