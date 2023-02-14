package route

import (
	"time"

	"github.com/gin-gonic/gin"

	"app/api/controller"
	"app/bootstrap"
	db "app/db/sqlc"
)

func NewPostRouter(env *bootstrap.Env, timeout time.Duration, store db.Store, group *gin.RouterGroup) {
	pc := &controller.PostController{
		Store: store,
		Env:   env,
	}

	group.POST("/create", pc.Add)
	group.GET("", pc.GetPostsByUser)
	group.PUT("/:postID", pc.Like)
	group.DELETE("/delete/:postID", pc.Remove)

	commentRouter := group.Group("/:postID/comments")
	NewCommentRouter(env, timeout, store, commentRouter)
}
