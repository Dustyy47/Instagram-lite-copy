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

	db, err := db.Connect(env.DBDriver, env.DBSource)
	if err != nil {
		logrus.Fatal("Failed to connect to Postgresql", err)
	}
	logrus.Printf("Connected to Postgresql")

	store := sqlc_db.NewStore(db)

	DBName := env.DBDriver
	runDBMigration(db, DBName, env.MigrationURL)

	timeout := time.Duration(env.ContextTimeout) * time.Second

	gin := gin.Default()
	router := gin.Group("")
	route.Setup(env, timeout, store, router)

	gin.Run(env.ServerAddress)
}

func runDBMigration(db *sql.DB, DBname, migrationURL string) {
	driver, _ := postgres.WithInstance(db, &postgres.Config{})

	migration, err := migrate.NewWithDatabaseInstance(
		migrationURL,
		DBname, // "postgres"
		driver)
	if err != nil {
		logrus.Fatal("Cannot create new migrate instance", err)
	}

	if err = migration.Up(); err != nil && err != migrate.ErrNoChange {
		logrus.Fatal("Failed to run migrate up", err)
	}

	logrus.Printf("DB migrated successfully")
}
