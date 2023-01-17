package main

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"

	route "github.com/Dustyy47/Instagram-lite-copy/server-go/api/route"
	"github.com/Dustyy47/Instagram-lite-copy/server-go/bootstrap"
	"github.com/Dustyy47/Instagram-lite-copy/server-go/mongo"
)

func main() {
	logrus.SetFormatter(new(logrus.JSONFormatter))

	env := bootstrap.NewEnv()

	db := mongo.NewMongoDatabase(env.DB_URL)
	defer mongo.CloseMongoDBConnection(db)
	logrus.Printf("Connected to MongoDB")

	timeout := time.Duration(env.ContextTimeout) * time.Second

	gin := gin.Default()

	router := gin.Group("")

	route.Setup(env, timeout, db.Database(env.DBName), router)

	gin.Run(env.ServerAddress)
}
