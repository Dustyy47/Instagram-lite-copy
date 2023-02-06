package driverdb

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

const (
	dbdriver      = "postgres"
	postgresDSFmt = "host=%s port=%s user=%s password=%s dbname='%s' sslmode=disable"
)

type DB struct {
	SQL *sql.DB
}

var db = &DB{}

func Connect(host, port, user, password, dbname string) *DB {
	dataSourceName := fmt.Sprintf(postgresDSFmt, host, port, user, password, dbname)

	pool, err := sql.Open(dbdriver, dataSourceName)
	if err != nil {
		panic(err)
	}

	db.SQL = pool
	return db
}
