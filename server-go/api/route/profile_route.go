package route

import (
	"time"

	"github.com/gin-gonic/gin"

	"app/api/controller"
	"app/bootstrap"
	db "app/db/sqlc"
)

func NewProfileRouter(env *bootstrap.Env, timeout time.Duration, store db.Store, group *gin.RouterGroup) {
	pc := &controller.ProfileController{
		Store: store,
		Env:   env,
	}

	group.GET("/:id", pc.GetProfileData)
	group.GET("/:nickname", pc.GetProfileData)
	group.PATCH("/me", pc.UpdateProfile)
	group.GET("/:id/follow", pc.ToggleFollow)
}
