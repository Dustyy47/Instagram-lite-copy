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

// @Summary Get profile data
// @Description Get profile data for the user with the given ID or nickname or nothing if user is autherization
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
// @Router /profiles/me [get]
// @security ApiKeyAuth
func (pc *ProfileController) GetProfileData(c *gin.Context) {
	var user db.User
	var err error

	ids := c.Params.ByName("id")
	nickname := c.Params.ByName("nickname")

	if nickname != "" {
		user, err = pc.Store.GetUserByNickname(c, nickname)
		if err != nil {
			c.JSON(http.StatusNotFound, errorResponse("Profile not found"))
			return
		}
	} else if ids != "" {
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
		userID := c.GetInt64("userID")
		user, err = pc.Store.GetUserByID(c, userID)
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
		UserID:        user.ID,
		Email:         user.Email,
		Nickname:      user.Nickname,
		Fullname:      user.Fullname,
		AvatarURL:     user.AvatarUrl,
		NumFollowers:  numFollowers,
		NumFollowing:  numFollowing,
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
	Limit  int32 `form:"limit" binding:"min=0"`
	Offset int32 `form:"offset" binding:"min=0"`
}

type FindUsersResponse []struct {
	UserId    int64
	NickName  string
	FullName  string
	AvatarUrl string
}

// @Summary Find users by nickname
// @Description Find users by nickname with pagination
// @Tags Profile
// @Accept  json
// @Produce  json
// @Param name path string true "User nickname"
// @Param limit query int false "Limit"
// @Param offset query int false "Offset"
// @Success 200 {object} FindUsersResponse
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

	if request.Limit == 0 {
		request.Limit = pc.Env.DefaultLimitFindUsers
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

	findUsersResponse := make(FindUsersResponse, len(users))
	for i, user := range users {
		findUsersResponse[i] = struct {
			UserId    int64
			NickName  string
			FullName  string
			AvatarUrl string
		}{
			UserId:    user.ID,
			NickName:  user.Nickname,
			FullName:  user.Fullname,
			AvatarUrl: user.AvatarUrl,
		}
	}
	c.JSON(http.StatusOK, findUsersResponse)
}
