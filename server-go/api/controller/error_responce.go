package controller

import "github.com/gin-gonic/gin"

func errorResponse(message string) gin.H {
	return gin.H{"Message": message}
}
