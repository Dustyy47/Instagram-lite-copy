package route

import (
	"time"

	"github.com/gin-gonic/gin"

	"app/bootstrap"
	"app/driverdb"

	"app/api/middleware"
)

func Setup(env *bootstrap.Env, timeout time.Duration, db *driverdb.DB, router *gin.RouterGroup) {
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
