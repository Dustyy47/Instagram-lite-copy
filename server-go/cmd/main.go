package main

import (
	"database/sql"
	"net"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/lib/pq"
	"github.com/sirupsen/logrus"

	route "app/api/route"
	"app/bootstrap"
	"app/db"
	sqlc_db "app/db/sqlc"
)

func main() {
	logrus.SetFormatter(new(logrus.JSONFormatter))

	env := bootstrap.NewEnv()

	logrus.Print(env.DBSource)
	db, err := db.Connect(env.DBDriver, env.DBSource)
	if err != nil {
		logrus.Fatalf("failed to connect to Postgresql: %v", err)
	}
	logrus.Infof("connected to Postgresql")

	store := sqlc_db.NewStore(db)

	DBName := env.DBDriver
	runDBMigration(db, DBName, env.MigrationURL)

	timeout := time.Duration(env.ContextTimeout) * time.Second

	gin := gin.Default()

	fs := http.FileServer(http.Dir("./doc/swagger"))
	mux := http.NewServeMux()
	mux.Handle("/swagger/", http.StripPrefix("/swagger/", fs))

	listener, err := net.Listen("tcp", "0.0.0.0:8000")
	if err != nil {
		logrus.Fatalf("cannot create listener: %w", err)
	}

	logrus.Info("start HTTP gateway server at %s", listener.Addr().String())
	err = http.Serve(listener, mux)
	if err != nil {
		logrus.Fatalf("cannot start HTTP gateway server: %w", err)
	}

	router := gin.Group("/v1/")
	route.Setup(env, timeout, store, router)

	logrus.Infof("server running on address: %s", env.ServerAddress)
	gin.Run(env.ServerAddress)
}

func runDBMigration(db *sql.DB, DBname, migrationURL string) {
	driver, _ := postgres.WithInstance(db, &postgres.Config{})

	migration, err := migrate.NewWithDatabaseInstance(
		migrationURL,
		DBname, // "postgres"
		driver)
	if err != nil {
		logrus.Fatalf("cannot create new migrate instance: %v", err)
	}

	if err = migration.Up(); err != nil && err != migrate.ErrNoChange {
		logrus.Fatalf("failed to run migrate up: %v", err)
	}

	logrus.Printf("db migrated successfully")
}
