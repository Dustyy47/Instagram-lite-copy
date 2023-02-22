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

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

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

	ginEngine := gin.Default()

	// Serve the Swagger UI files.
	ginEngine.Static("/swagger/", "./doc/swagger")

	// Serve the Swagger JSON endpoint.
	swaggerURL := ginSwagger.URL("swagger/server_go.swagger.json")
	ginEngine.GET("/swagger-docs/*any", ginSwagger.WrapHandler(swaggerFiles.Handler, swaggerURL))

	router := ginEngine.Group("/v1/")
	route.Setup(env, timeout, store, router)

	logrus.Infof("server running on address: %s", env.ServerAddress)
	ginEngine.Run(env.ServerAddress)
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
