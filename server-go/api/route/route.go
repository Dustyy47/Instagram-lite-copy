package route

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"app/api/middleware"
	"app/bootstrap"
	db "app/db/sqlc"
)

func Setup(env *bootstrap.Env, timeout time.Duration, store db.Store, router *gin.RouterGroup) {
	router.GET("/ping", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	authRouter := router.Group("auth")
	NewAuthRouter(env, timeout, store, authRouter)

	profileRouter := router.Group("profiles")
	profileRouter.Use(middleware.JwtAuthMiddleware(env.AccessTokenSecret))
	NewProfileRouter(env, timeout, store, profileRouter)

	postRouter := router.Group("posts")
	postRouter.Use(middleware.JwtAuthMiddleware(env.AccessTokenSecret))
	NewPostRouter(env, timeout, store, postRouter)

	conversationRouter := router.Group("conversation")
	NewConversationRouter(env, timeout, store, conversationRouter)
}
