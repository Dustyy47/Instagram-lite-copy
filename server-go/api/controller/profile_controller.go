package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/Dustyy47/Instagram-lite-copy/server-go/bootstrap"
	"github.com/Dustyy47/Instagram-lite-copy/server-go/domain"
)

type ProfileController struct {
	UserUsecase domain.UserUsecase

	Env *bootstrap.Env
}

func (pc *ProfileController) GetProfileData(c *gin.Context) {
	var request domain.GetProfileDataRequest

	err := c.ShouldBind(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: err.Error()})
		return
	}

	nickName := c.Params.ByName("nickname")

	user, err := pc.UserUsecase.GetUserByNickName(c, nickName)
	if err != nil {
		c.JSON(http.StatusNotFound, domain.ErrorResponse{Message: "Profile not found with nickname: " + nickName})
		return
	}

	isUserProfile := c.Keys["userID"] == user.ID.Hex()

	getProfileDataResponse := domain.GetProfileDataResponse{
		ID:       user.ID,
		Email:    user.Email,
		NickName: user.NickName,

		AvatarURL: user.AvatarURL,

		Subscribes:  user.Subscribes,
		Subscribers: user.Subscribers,

		IsUserProfile: isUserProfile,
	}

	c.JSON(http.StatusOK, getProfileDataResponse)
}
