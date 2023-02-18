package route

import (
	"time"

	"github.com/gin-gonic/gin"

	"app/api/controller"
	"app/bootstrap"
	db "app/db/sqlc"
)

func NewConversationRouter(env *bootstrap.Env, timeout time.Duration, store db.Store, group *gin.RouterGroup) {
	cc := &controller.ConversationController{
		Store: store,
		Env:   env,
	}

	group.POST("create", cc.Create)
	group.GET("/:conversation_id", cc.Run)
}
