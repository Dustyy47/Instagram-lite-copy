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

func NewAuthRouter(env *bootstrap.Env, timeout time.Duration, db *driverdb.DB, group *gin.RouterGroup) {
	ur := repository.NewUserRepository(db, domain.CollectionUser)
	ac := &controller.AuthController{
		UserUsecase: usecase.NewUserUsecase(ur, timeout),
		Env:         env,
	}

	group.POST("/registration", ac.Register)
	group.POST("/login", ac.Login)
}
