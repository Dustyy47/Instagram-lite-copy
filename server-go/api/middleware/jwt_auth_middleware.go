package middleware

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"

	"app/domain"
	"app/internal/util"
)

func JwtAuthMiddleware(secret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.Request.Header.Get("Authorization")
		t := strings.Split(authHeader, " ")
		if len(t) == 2 {
			authToken := t[1]

			authorized, err := util.IsAuthorized(authToken, secret)
			if authorized {
				userIDs, err := util.ExtractIDFromToken(authToken, secret)
				if err != nil {
					c.JSON(http.StatusUnauthorized, domain.ErrorResponse{Message: err.Error()})
					c.Abort()
					return
				}

				userID, err := strconv.ParseInt(userIDs, 10, 64)
				if err != nil {
					c.JSON(http.StatusUnauthorized, domain.ErrorResponse{Message: err.Error()})
					c.Abort()
					return
				}

				c.Set("userID", userID)
				c.Next()
				return
			}

			c.JSON(http.StatusUnauthorized, domain.ErrorResponse{Message: err.Error()})
			c.Abort()
			return
		}

		c.JSON(http.StatusUnauthorized, domain.ErrorResponse{Message: "Not authorized"})
		c.Abort()
	}
}
