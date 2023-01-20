package route

import (
	"time"

	"github.com/gin-gonic/gin"

	"github.com/Dustyy47/Instagram-lite-copy/server-go/api/middleware"
	"github.com/Dustyy47/Instagram-lite-copy/server-go/bootstrap"
	"github.com/Dustyy47/Instagram-lite-copy/server-go/mongo"
)

func Setup(env *bootstrap.Env, timeout time.Duration, db mongo.Database, router *gin.RouterGroup) {
	authRouter := router.Group("auth")
	// All Public APIs
	NewAuthRouter(env, timeout, db, authRouter)

	profileRouter := router.Group("profile")
	// Middleware to verify AccessToken
	profileRouter.Use(middleware.JwtAuthMiddleware(env.AccessTokenSecret))
	// All Private APIs
	NewProfileRouter(env, timeout, db, profileRouter)

	postRouter := router.Group("posts")
	// Middleware to verify AccessToken
	postRouter.Use(middleware.JwtAuthMiddleware(env.AccessTokenSecret))
	// All Private APIs
	NewPostRouter(env, timeout, db, postRouter)
}
