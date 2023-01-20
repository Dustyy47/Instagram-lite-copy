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

func NewCommentRouter(env *bootstrap.Env, timeout time.Duration, db mongo.Database, group *gin.RouterGroup) {
	cr := repository.NewCommentRepository(db, domain.CollectionComments)
	pr := repository.NewPostRepository(db, domain.CollectionPosts)
	ur := repository.NewUserRepository(db, domain.CollectionUser)

	cc := &controller.CommentController{
		CommentUsecase: usecase.NewCommentUsecase(cr, timeout),
		PostUsecase:    usecase.NewPostUsecase(pr, timeout),
		UserUsecase:    usecase.NewUserUsecase(ur, timeout),

		Env: env,
	}

	group.POST("/create", cc.Add)
}
