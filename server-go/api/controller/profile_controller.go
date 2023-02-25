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
	"app/internal/util"
)

type ProfileController struct {
	Store db.Store
	Env   *bootstrap.Env
}

type GetProfileDataResponse struct {
	UserID   int64  `json:"userID"`
	Email    string `json:"email"`
	Nickname string `json:"nickname"`
	Fullname string `json:"fullname"`

	AvatarURL string `json:"avatarUrl"`

	NumFollowers int64 `json:"numFollowers"`
	NumFollowing int64 `json:"numFollowing"`

	IsUserProfile bool `json:"isUserProfile"`
}

// GetProfileData fetches profile data for a given user.
//
// @Summary Get profile data
// @Description Get profile data for the user with the given ID or nickname
// @Tags Profile
// @Accept json
// @Produce json
// @Param nickname path string false "User nickname"
// @Param id path int64 false "User ID"
// @Success 200 {object} GetProfileDataResponse
// @Failure 400 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /profiles/id/{id} [get]
// @Router /profiles/nickname/{nickname} [get]
// @security ApiKeyAuth
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
		Nickname: user.Nickname,
		Fullname: user.Fullname,

		AvatarURL: user.AvatarUrl,

		NumFollowers: numFollowers,
		NumFollowing: numFollowing,

		IsUserProfile: isUserProfile,
	}

	c.JSON(http.StatusOK, getProfileDataResponse)
}

type UpdateProfileResponse struct {
	UserID    int64  `json:"userID"`
	Email     string `json:"email"`
	Fullname  string `json:"fullname"`
	Nickname  string `json:"nickname"`
	AvatarUrl string `json:"avatarUrl"`
}

// @Summary Update user profile
// @Description Update the profile information for the authenticated user
// @Tags Profile
// @Accept multipart/form-data
// @Produce json
// @Param fullname formData string false "User full name"
// @Param email formData string false "User email address"
// @Param nickname formData string false "User nickname"
// @Param avatarImage formData file false "User avatar image"
// @Success 200 {object} UpdateProfileResponse
// @Failure 400 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /profiles/me [patch]
// @security ApiKeyAuth
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
		Fullname:  util.DefaultIfEmpty(fullname, user.Fullname),
		Email:     util.DefaultIfEmpty(email, user.Email),
		Nickname:  util.DefaultIfEmpty(nickname, user.Nickname),
		AvatarUrl: util.DefaultIfEmpty(avatarUrl, user.AvatarUrl),
	}

	user, err = pc.Store.UpdateUser(c, updateUserArg)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse("Error updating user information"))
		return
	}

	updateProfileResponse := UpdateProfileResponse{
		UserID:    user.ID,
		Email:     user.Email,
		Fullname:  user.Fullname,
		Nickname:  user.Nickname,
		AvatarUrl: user.AvatarUrl,
	}
	c.JSON(http.StatusOK, updateProfileResponse)
}

// @Summary Toggle follow/unfollow user
// @Description Toggle follow/unfollow user by user ID
// @Tags Profile
// @Accept  json
// @Produce  json
// @Param id path int64 true "User ID to follow/unfollow"
// @Success 200 {object} SuccessResponse
// @Failure 400 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /profiles/id/{id}/follow [put]
// @security ApiKeyAuth
func (pc *ProfileController) ToggleFollow(c *gin.Context) {
	userIDToFollow, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, errorResponse("Invalid id parameter"))
		return
	}

	userID := c.GetInt64("userID")

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

		c.JSON(http.StatusOK, successResponse("Unfollowed successfully"))
	} else { // follow
		createFollowerArg := db.CreateFollowerParams{
			UserFromID: userID,
			UserToID:   userIDToFollow,
		}

		_, err = pc.Store.CreateFollower(c, createFollowerArg)
		if err != nil {
			c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
			return
		}

		c.JSON(http.StatusOK, successResponse("Followed successfully"))
	}
}

type FindUsersRequest struct {
	Limit  int32 `form:"limit" binding:"required"`
	Offset int32 `form:"offset" binding:"min=0"`
}

// @Summary Find users by nickname
// @Description Find users by nickname with pagination
// @Tags Profile
// @Accept  json
// @Produce  json
// @Param name path string true "User nickname"
// @Param limit query int true "Number of results to return"
// @Param offset query int false "Number of results to skip"
// @Success 200 {array} map[string]interface{}
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /profiles/find/{name} [get]
// @security ApiKeyAuth
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
