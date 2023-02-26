package route

import (
	"time"

	"github.com/gin-gonic/gin"

	"app/api/controller"
	"app/bootstrap"
	db "app/db/sqlc"
)

func NewCommentRouter(env *bootstrap.Env, timeout time.Duration, store db.Store, group *gin.RouterGroup) {
	cc := &controller.CommentController{
		Store: store,
		Env:   env,
	}

	group.POST("/create", cc.Add)
	group.DELETE("/:commentID", cc.Remove)
	group.GET("", cc.GetCommentsOfPost)
	group.PUT("/:commentID/like", cc.Like)
}
