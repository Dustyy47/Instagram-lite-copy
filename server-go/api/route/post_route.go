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

func NewPostRouter(env *bootstrap.Env, timeout time.Duration, db mongo.Database, group *gin.RouterGroup) {
	pr := repository.NewPostRepository(db, domain.CollectionPosts)
	pc := &controller.PostController{
		PostUsecase: usecase.NewPostUsecase(pr, timeout),
		Env:         env,
	}

	group.POST("/posts/create", pc.Add)
	group.DELETE("/posts/delete/:postID", pc.Remove)

	//group.GET("/posts/:id", pc.)
}
