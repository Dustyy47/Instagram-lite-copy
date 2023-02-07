package main

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"

	route "app/api/route"
	"app/bootstrap"
	"app/driverdb"
)

func main() {
	logrus.SetFormatter(new(logrus.JSONFormatter))

	env := bootstrap.NewEnv()

	db := driverdb.Connect(env.DbHost, env.DbPort, env.DbUser, env.DbPassword, env.DbName)
	err := db.SQL.Ping()
	if err != nil {
		panic(err)
	}
	logrus.Printf("Connected to Postgresql")

	timeout := time.Duration(env.ContextTimeout) * time.Second

	gin := gin.Default()

	router := gin.Group("")

	route.Setup(env, timeout, db, router)

	gin.Run(env.ServerAddress)
}
