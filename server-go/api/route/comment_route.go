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

func NewCommentRouter(env *bootstrap.Env, timeout time.Duration, db *driverdb.DB, group *gin.RouterGroup) {
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
