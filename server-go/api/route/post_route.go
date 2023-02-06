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

func NewPostRouter(env *bootstrap.Env, timeout time.Duration, db *driverdb.DB, group *gin.RouterGroup) {
	pr := repository.NewPostRepository(db, domain.CollectionPosts)
	ur := repository.NewUserRepository(db, domain.CollectionUser)

	pc := &controller.PostController{
		PostUsecase: usecase.NewPostUsecase(pr, timeout),
		UserUsecase: usecase.NewUserUsecase(ur, timeout),

		Env: env,
	}

	group.POST("/create", pc.Add)
	group.GET("", pc.GetPostsByUser)
	group.PUT("/:postID", pc.Like)
	group.DELETE("/delete/:postID", pc.Remove)

	commentRouter := group.Group("/:postID/comments")
	NewCommentRouter(env, timeout, db, commentRouter)
}
