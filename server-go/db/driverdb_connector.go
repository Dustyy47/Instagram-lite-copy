package db

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

const (
	dbdriver      = "postgres"
	postgresDSFmt = "host=%s port=%s user=%s password=%s dbname='%s' sslmode=disable"
)

func Connect(host, port, user, password, dbname string) (*sql.DB, error) {
	dataSourceName := fmt.Sprintf(postgresDSFmt, host, port, user, password, dbname)

	conn, err := sql.Open(dbdriver, dataSourceName)
	if err != nil {
		return conn, err
	}

	err = conn.Ping()
	return conn, err
}
