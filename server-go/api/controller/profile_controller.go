package controller

import (
	"fmt"
	"mime/multipart"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"

	"app/bootstrap"
	db "app/db/sqlc"
)

type ProfileController struct {
	Store db.Store
	Env   *bootstrap.Env
}

type GetProfileDataResponse struct {
	UserID   int64  `json:"userID"`
	Email    string `json:"email"`
	NickName string `json:"nickname"`
	FullName string `json:"fullname"`

	AvatarURL string `json:"avatarUrl"`

	NumFollowers int64 `json:"numFollowers"`
	NumFollowing int64 `json:"numFollowing"`

	IsUserProfile bool `json:"isUserProfile"`
}

func (pc *ProfileController) GetProfileData(c *gin.Context) {
	var request struct{}

	err := c.ShouldBind(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, errorResponse(err.Error()))
		return
	}

	var user db.User
	nickname, ok := c.Params.Get("nickname")
	if !ok {
		ids := c.Params.ByName("id")
		id, err := strconv.ParseInt(ids, 10, 64)
		if err != nil {
			c.JSON(http.StatusNotFound, errorResponse("Profile not found"))
			return
		}

		user, err = pc.Store.GetUserByID(c, id)
		if err != nil {
			c.JSON(http.StatusNotFound, errorResponse("Profile not found"))
			return
		}

	} else {
		user, err = pc.Store.GetUserByNickname(c, nickname)
		if err != nil {
			c.JSON(http.StatusNotFound, errorResponse("Profile not found"))
			return
		}
	}

	numFollowers, err := pc.Store.GetNumFollowers(c, user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
		return
	}

	numFollowing, err := pc.Store.GetNumFollowing(c, user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
		return
	}

	userID := c.GetInt64("userID")
	isUserProfile := userID == user.ID

	getProfileDataResponse := GetProfileDataResponse{
		UserID:   user.ID,
		Email:    user.Email,
		NickName: user.Nickname,

		AvatarURL: user.AvatarUrl,

		NumFollowers: numFollowers,
		NumFollowing: numFollowing,

		IsUserProfile: isUserProfile,
	}

	c.JSON(http.StatusOK, getProfileDataResponse)
}

func (pc *ProfileController) UpdateProfile(c *gin.Context) {
	var (
		fullname, email, nickname string
		avatarImage               *multipart.FileHeader
		avatarUrl                 string
		err                       error
	)

	fullname = c.PostForm("fullname")
	email = c.PostForm("email")
	nickname = c.PostForm("nickname")
	avatarImage, err = c.FormFile("avatarImage")
	if err != nil && err != http.ErrMissingFile {
		c.JSON(http.StatusBadRequest, errorResponse("Error uploading avatar image"))
		return
	}

	userID := c.GetInt64("userID")

	user, err := pc.Store.GetUserByID(c, userID)
	if err != nil {
		c.JSON(http.StatusNotFound, errorResponse("Profile not found"))
		return
	}

	if avatarImage != nil {
		avatarUrl = fmt.Sprintf("%d--%s", time.Now().Unix(), avatarImage.Filename)
		err = c.SaveUploadedFile(avatarImage, "images/avatars/"+avatarUrl)
		if err != nil {
			c.JSON(http.StatusInternalServerError, errorResponse("Error saving avatar image"))
			return
		}
	}

	// Update user information
	if fullname == "" && email == "" && nickname == "" && avatarUrl == "" {
		c.JSON(http.StatusBadRequest, errorResponse("No updates provided"))
		return
	}

	updateUserArg := db.UpdateUserParams{
		ID:        user.ID,
		Fullname:  NotEmpty(fullname, user.Fullname),
		Email:     NotEmpty(email, user.Email),
		Nickname:  NotEmpty(nickname, user.Nickname),
		AvatarUrl: NotEmpty(avatarUrl, user.AvatarUrl),
	}

	user, err = pc.Store.UpdateUser(c, updateUserArg)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse("Error updating user information"))
		return
	}

	c.JSON(http.StatusOK, user)
}

func NotEmpty(s1, defaultStr string) string {
	if s1 == "" {
		return defaultStr
	}
	return s1
}

func (pc *ProfileController) ToggleFollow(c *gin.Context) {
	userIDToFollow, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, errorResponse("Invalid id parameter"))
		return
	}

	userID := c.GetInt64("user_id")

	_, err = pc.Store.GetUserByID(c, userID)
	if err != nil {
		c.JSON(http.StatusNotFound, errorResponse("User not found"))
		return
	}

	_, err = pc.Store.GetUserByID(c, userIDToFollow)
	if err != nil {
		c.JSON(http.StatusBadRequest, errorResponse("User not found"))
		return
	}

	if userID == userIDToFollow {
		c.JSON(http.StatusBadRequest, errorResponse("You can't follow yourself"))
		return
	}

	getFollowerArg := db.GetFollowerParams{
		UserFromID: userID,
		UserToID:   userIDToFollow,
	}

	_, err = pc.Store.GetFollower(c, getFollowerArg)
	isFollowing := err == nil

	if isFollowing { // then unfollow
		deleteFollowerArg := db.DeleteFollowerParams{
			UserFromID: userID,
			UserToID:   userIDToFollow,
		}

		pc.Store.DeleteFollower(c, deleteFollowerArg)
		if err != nil {
			c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
			return
		}

		c.JSON(http.StatusOK, successResponce("Unfollowed successfully"))
	} else { // follow
		createFollowerArg := db.CreateFollowerParams{
			UserFromID: userID,
			UserToID:   userIDToFollow,
		}

		pc.Store.CreateFollower(c, createFollowerArg)
		if err != nil {
			c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
			return
		}

		c.JSON(http.StatusOK, successResponce("Followed successfully"))
	}
}

type FindUsersRequest struct {
	Limit  int32 `form:"limit" binding:"required"`
	Offset int32 `form:"offset" binding:"min=0"`
}

func (pc *ProfileController) FindUsers(c *gin.Context) {
	var request FindUsersRequest

	err := c.ShouldBind(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, errorResponse(err.Error()))
		return
	}

	name := c.Param("name")

	findUsersByNicknameArgs := db.FindUsersByNicknameParams{
		Nickname: name,
		Limit:    request.Limit,
		Offset:   request.Offset,
	}

	users, err := pc.Store.FindUsersByNickname(c, findUsersByNicknameArgs)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
		return
	}

	response := make([]map[string]interface{}, 0)
	for _, user := range users {
		response = append(response, map[string]interface{}{
			"nickName":  user.Nickname,
			"fullName":  user.Fullname,
			"avatarUrl": user.AvatarUrl,
			"userId":    user.ID,
		})
	}

	c.JSON(http.StatusOK, response)
}
