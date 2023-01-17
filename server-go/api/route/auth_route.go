package route

import (
	"time"

	"github.com/gin-gonic/gin"

	"github.com/Dustyy47/Instagram-lite-copy/server-go/api/controller"
	"github.com/Dustyy47/Instagram-lite-copy/server-go/bootstrap"
	"github.com/Dustyy47/Instagram-lite-copy/server-go/domain"
	"github.com/Dustyy47/Instagram-lite-copy/server-go/mongo"
	"github.com/Dustyy47/Instagram-lite-copy/server-go/repository"
	"github.com/Dustyy47/Instagram-lite-copy/server-go/usecase"
)

func NewAuthRouter(env *bootstrap.Env, timeout time.Duration, db mongo.Database, group *gin.RouterGroup) {
	ur := repository.NewUserRepository(db, domain.CollectionUser)
	ac := &controller.AuthController{
		AuthUsecase: usecase.NewAuthUsecase(ur, timeout),
		Env:         env,
	}

	group.POST("/registration", ac.Register)
	group.POST("/login", ac.Login)
}
