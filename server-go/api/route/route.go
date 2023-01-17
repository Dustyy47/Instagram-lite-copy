package route

import (
	"time"

	"github.com/gin-gonic/gin"

	"github.com/Dustyy47/Instagram-lite-copy/server-go/bootstrap"
	"github.com/Dustyy47/Instagram-lite-copy/server-go/mongo"
)

func Setup(env *bootstrap.Env, timeout time.Duration, db mongo.Database, router *gin.RouterGroup) {
	authRouter := router.Group("auth")
	// All Public APIs
	NewAuthRouter(env, timeout, db, authRouter)
}
