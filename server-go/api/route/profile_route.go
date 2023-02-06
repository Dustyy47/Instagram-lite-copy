package route

import (
	"time"

	"github.com/gin-gonic/gin"

	"app/api/controller"
	"app/bootstrap"
	"app/domain"
	"app/driverdb"
	"app/repository"
	"app/usecase"
)

func NewProfileRouter(env *bootstrap.Env, timeout time.Duration, db *driverdb.DB, group *gin.RouterGroup) {
	ur := repository.NewUserRepository(db, domain.CollectionUser)
	pc := &controller.ProfileController{
		UserUsecase: usecase.NewUserUsecase(ur, timeout),
		Env:         env,
	}

	group.GET("/:nickname", pc.GetProfileData)
	group.GET("/me", pc.GetUserData)
}
