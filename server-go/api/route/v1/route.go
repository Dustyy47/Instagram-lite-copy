package route

import (
	"time"

	"github.com/gin-gonic/gin"

	"github.com/Dustyy47/Instagram-lite-copy/server-go/bootstrap"
	"github.com/Dustyy47/Instagram-lite-copy/server-go/mongo"
)

func Setup(env *bootstrap.Env, timeout time.Duration, db mongo.Database, routerV1 *gin.RouterGroup) {
	publicRouterV1 := routerV1.Group("")
	// All Public APIs
	NewRegisterRouter(env, timeout, db, publicRouterV1)
	NewLoginRouter(env, timeout, db, publicRouterV1)
}
