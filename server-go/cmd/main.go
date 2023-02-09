package main

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"

	route "app/api/route"
	"app/bootstrap"
	"app/db"
	sqlc_db "app/db/sqlc"
)

func main() {
	logrus.SetFormatter(new(logrus.JSONFormatter))

	env := bootstrap.NewEnv()

	db, err := db.Connect(env.DbHost, env.DbPort, env.DbUser, env.DbPassword, env.DbName)
	if err != nil {
		logrus.Fatal("Failed to connect to Postgresql", err)
	}
	logrus.Printf("Connected to Postgresql")

	store := sqlc_db.NewStore(db)

	timeout := time.Duration(env.ContextTimeout) * time.Second

	gin := gin.Default()
	router := gin.Group("")
	route.Setup(env, timeout, store, router)

	gin.Run(env.ServerAddress)
}
