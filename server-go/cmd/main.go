package main

import (
	"database/sql"
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
		logrus.Fatalf("Failed to connect to Postgresql: %v", err)
	}
	logrus.Infof("Connected to Postgresql")

	store := sqlc_db.NewStore(db)

	DBName := env.DBDriver
	runDBMigration(db, DBName, env.MigrationURL)

	timeout := time.Duration(env.ContextTimeout) * time.Second

	gin := gin.Default()
	router := gin.Group("/api/")
	route.Setup(env, timeout, store, router)

	logrus.Infof("Server running on address: %s", env.ServerAddress);
	gin.Run(env.ServerAddress)
}

func runDBMigration(db *sql.DB, DBname, migrationURL string) {
	driver, _ := postgres.WithInstance(db, &postgres.Config{})

	migration, err := migrate.NewWithDatabaseInstance(
		migrationURL,
		DBname, // "postgres"
		driver)
	if err != nil {
		logrus.Fatalf("Cannot create new migrate instance: %v", err)
	}

	if err = migration.Up(); err != nil && err != migrate.ErrNoChange {
		logrus.Fatalf("Failed to run migrate up: %v", err)
	}

	logrus.Printf("DB migrated successfully")
}
