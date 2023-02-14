package route

import (
	"time"

	"github.com/gin-gonic/gin"

	"app/api/controller"
	"app/bootstrap"
	db "app/db/sqlc"
)

func NewAuthRouter(env *bootstrap.Env, timeout time.Duration, store db.Store, group *gin.RouterGroup) {
	ac := &controller.AuthController{
		Store: store,
		Env:   env,
	}

	group.POST("/registration", ac.Register)
	group.POST("/login", ac.Login)
}
