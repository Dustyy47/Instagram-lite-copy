package controller

import "github.com/gin-gonic/gin"

func successResponce(message string) gin.H {
	return gin.H{"Message": message}
}
