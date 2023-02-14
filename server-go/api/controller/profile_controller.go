package controller

import (
	"github.com/gin-gonic/gin"

	"app/bootstrap"
	db "app/db/sqlc"
)

type ProfileController struct {
	Store db.Store
	Env   *bootstrap.Env
}

func (pc *ProfileController) GetProfileData(c *gin.Context) {
	// var request domain.GetProfileDataRequest

	// err := c.ShouldBind(&request)
	// if err != nil {
	// 	c.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: err.Error()})
	// 	return
	// }

	// nickName := c.Params.ByName("nickname")

	// user, err := pc.UserUsecase.GetUserByNickName(c, nickName)
	// if err != nil {
	// 	c.JSON(http.StatusNotFound, domain.ErrorResponse{Message: "Profile not found with nickname: " + nickName})
	// 	return
	// }

	// isUserProfile := c.Keys["userID"] == user.ID.Hex()

	// getProfileDataResponse := domain.GetProfileDataResponse{
	// 	UserID:   user.ID,
	// 	Email:    user.Email,
	// 	NickName: user.NickName,

	// 	AvatarURL: user.AvatarURL,

	// 	Subscribes:  user.Subscribes,
	// 	Subscribers: user.Subscribers,

	// 	IsUserProfile: isUserProfile,
	// }

	// c.JSON(http.StatusOK, getProfileDataResponse)
}

func (pc *ProfileController) GetUserData(c *gin.Context) {
	// var request domain.GetUserDataRequest

	// err := c.ShouldBind(&request)
	// if err != nil {
	// 	c.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: err.Error()})
	// 	return
	// }

	// userID := c.GetString("userID")

	// user, err := pc.UserUsecase.GetByID(c, userID)
	// if err != nil {
	// 	c.JSON(http.StatusNotFound, domain.ErrorResponse{Message: "User not found with id: " + userID})
	// 	return
	// }

	// getUserDataResponse := domain.GetUserDataResponse{
	// 	UserID:   user.ID,
	// 	Email:    user.Email,
	// 	NickName: user.NickName,
	// 	FullName: user.FullName,

	// 	AvatarURL: user.AvatarURL,

	// 	LikedPosts: user.LikedPosts,
	// 	Subscribes: user.Subscribes,
	// }

	// c.JSON(http.StatusOK, getUserDataResponse)
}
