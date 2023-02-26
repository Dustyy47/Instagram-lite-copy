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

	group.GET("/id/:id", pc.GetProfileData)
	group.GET("/nickname/:nickname", pc.GetProfileData)
	group.GET("/me", pc.GetProfileData)

	group.PATCH("/me", pc.UpdateProfile)
	group.PUT("/id/:id/follow", pc.ToggleFollow)

	group.GET("/find/:name", pc.FindUsers)
}
