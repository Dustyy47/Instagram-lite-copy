package main

import (
	"database/sql"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/lib/pq"
	_ "github.com/santosh/gingo/docs"
	"github.com/sirupsen/logrus"

	route "app/api/route"
	"app/bootstrap"
	"app/db"
	sqlc_db "app/db/sqlc"
)

// @title           Instagram-lite-copy API
// @version         1.0
// @description     server-go
// @host            localhost:8000
// @BasePath        /v1
// @securityDefinitions.apiKey ApiKeyAuth
// @in header
// @name Authorization
func main() {
	logrus.SetFormatter(new(logrus.JSONFormatter))

	env := bootstrap.NewEnv()

	db, store := connectToDB(env)

	DBName := env.DBDriver
	runDBMigration(db, DBName, env.MigrationURL)

	timeout := time.Duration(env.ContextTimeout) * time.Second
	runGinServer(env, timeout, store)
}

func connectToDB(env *bootstrap.Env) (*sql.DB, sqlc_db.Store) {
	logrus.Print(env.DBSource)
	db, err := db.Connect(env.DBDriver, env.DBSource)
	if err != nil {
		logrus.Fatalf("failed to connect to Postgresql: %v", err)
	}
	logrus.Infof("connected to Postgresql")

	store := sqlc_db.NewStore(db)
	return db, store
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

func runGinServer(env *bootstrap.Env, timeout time.Duration, store sqlc_db.Store) {
	ginEngine := gin.Default()

	// CORS middleware
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	ginEngine.Use(cors.New(config))

	serveImagesFolder(ginEngine)
	connectSwaggerToGin(ginEngine)

	router := ginEngine.Group("/v1/")
	route.Setup(env, timeout, store, router)

	logrus.Infof("server running on address: %s", env.ServerAddress)
	ginEngine.Run(env.ServerAddress)
}

func serveImagesFolder(ginEngine *gin.Engine) {
	ginEngine.Static("/images", "./images")
}

func connectSwaggerToGin(ginEngine *gin.Engine) {
	// Serve the Swagger UI files
	ginEngine.Static("/swagger/", "./doc/swagger")
}
