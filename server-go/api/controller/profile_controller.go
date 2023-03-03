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

	IsFollowed bool `json:"isFollowed"`
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
	isUserProfile := (userID == user.ID)

	getFollowerArg := db.GetFollowerParams{
		UserFromID: userID,
		UserToID:   user.ID,
	}

	_, err = pc.Store.GetFollower(c, getFollowerArg)
	isFollowed := (err == nil)

	getProfileDataResponse := GetProfileDataResponse{
		UserID:        user.ID,
		Email:         user.Email,
		Nickname:      user.Nickname,
		Fullname:      user.Fullname,
		AvatarURL:     user.AvatarUrl,
		NumFollowers:  numFollowers,
		NumFollowing:  numFollowing,
		IsUserProfile: isUserProfile,
		IsFollowed:    isFollowed,
	}

	c.JSON(http.StatusOK, getProfileDataResponse)
}

// @Summary Get followers of user
// @Description Get followers of user with the given ID with pagination
// @Tags Profile
// @Accept json
// @Produce json
// @Param id path int64 false "User ID"
// @Param limit query int false "Limit"
// @Param offset query int false "Offset"
// @Success 200 {object} UsersResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /profiles/id/{id}/followers [get]
// @security ApiKeyAuth
func (pc *ProfileController) GetFollowers(c *gin.Context) {
	limit, err := strconv.Atoi(c.Query("limit"))
	if err != nil {
		limit = pc.Env.DefaultLimitGetPostsByUser
	}
	offset, _ := strconv.Atoi(c.Query("offset"))

	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusNotFound, errorResponse("Profile not found"))
		return
	}

	user, err := pc.Store.GetUserByID(c, id)
	if err != nil {
		c.JSON(http.StatusNotFound, errorResponse("Profile not found"))
		return
	}

	listFollowerOfUserArg := db.ListFollowerOfUserParams{
		UserToID: user.ID,
		Limit:    (int32)(limit),
		Offset:   (int32)(offset),
	}

	followers, err := pc.Store.ListFollowerOfUser(c, listFollowerOfUserArg)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
		return
	}

	usersResponse := UsersResponse{
		Users: make([]User, len(followers)),
	}

	for i, follower := range followers {
		userFrom, err := pc.Store.GetUserByID(c, follower.UserFromID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
			return
		}

		usersResponse.Users[i] = User{
			UserID:    userFrom.ID,
			Nickname:  userFrom.Nickname,
			Fullname:  userFrom.Fullname,
			AvatarUrl: userFrom.AvatarUrl,
		}
	}

	c.JSON(http.StatusOK, usersResponse)
}

// @Summary Get followings of user
// @Description Get followings of user with the given ID with pagination
// @Tags Profile
// @Accept json
// @Produce json
// @Param id path int64 false "User ID"
// @Param limit query int false "Limit"
// @Param offset query int false "Offset"
// @Success 200 {object} UsersResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /profiles/id/{id}/followings [get]
// @security ApiKeyAuth
func (pc *ProfileController) GetFollowings(c *gin.Context) {
	limit, err := strconv.Atoi(c.Query("limit"))
	if err != nil {
		limit = pc.Env.DefaultLimitGetPostsByUser
	}
	offset, _ := strconv.Atoi(c.Query("offset"))

	ids := c.Params.ByName("id")
	id, err := strconv.ParseInt(ids, 10, 64)
	if err != nil {
		c.JSON(http.StatusNotFound, errorResponse("Profile not found"))
		return
	}

	user, err := pc.Store.GetUserByID(c, id)
	if err != nil {
		c.JSON(http.StatusNotFound, errorResponse("Profile not found"))
		return
	}

	listFollowingrOfUserArg := db.ListFollowingOfUserParams{
		UserFromID: user.ID,
		Limit:      (int32)(limit),
		Offset:     (int32)(offset),
	}

	followings, err := pc.Store.ListFollowingOfUser(c, listFollowingrOfUserArg)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
		return
	}

	usersResponse := UsersResponse{
		Users: make([]User, len(followings)),
	}

	for i, following := range followings {
		userFrom, err := pc.Store.GetUserByID(c, following.UserFromID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
			return
		}

		usersResponse.Users[i] = User{
			UserID:    userFrom.ID,
			Nickname:  userFrom.Nickname,
			Fullname:  userFrom.Fullname,
			AvatarUrl: userFrom.AvatarUrl,
		}
	}

	c.JSON(http.StatusOK, usersResponse)
}

type UpdateProfileRequest struct {
	Email       string                `json:"email"`
	Fullname    string                `json:"fullname"`
	Nickname    string                `json:"nickname"`
	AvatarImage *multipart.FileHeader `form:"avatarImage"`
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
	var request UpdateProfileRequest
	err := c.ShouldBind(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, errorResponse(err.Error()))
		return
	}
	// Validate avatar image
	if request.AvatarImage != nil {
		err = util.ValidateImage(request.AvatarImage)
		if err != nil {
			c.JSON(http.StatusBadRequest, errorResponse(err.Error()))
			return
		}
	}

	userID := c.GetInt64("userID")

	user, err := pc.Store.GetUserByID(c, userID)
	if err != nil {
		c.JSON(http.StatusNotFound, errorResponse("Profile not found"))
		return
	}

	var avatarUrl string
	if request.AvatarImage != nil {
		avatarUrl = fmt.Sprintf("%d--%s", time.Now().Unix(), request.AvatarImage.Filename)
		err = c.SaveUploadedFile(request.AvatarImage, "images/avatars/"+avatarUrl)
		if err != nil {
			c.JSON(http.StatusInternalServerError, errorResponse("Error saving avatar image"))
			return
		}
	}

	// Update user information
	if request.Fullname == "" && request.Email == "" && request.Nickname == "" && avatarUrl == "" {
		c.JSON(http.StatusBadRequest, errorResponse("No updates provided"))
		return
	}

	updateUserArg := db.UpdateUserParams{
		ID:        user.ID,
		Fullname:  util.DefaultIfEmpty(request.Fullname, user.Fullname),
		Email:     util.DefaultIfEmpty(request.Email, user.Email),
		Nickname:  util.DefaultIfEmpty(request.Nickname, user.Nickname),
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

type ToggleFollowResponse struct {
	NumFollowers          int64 `json:"numFollowers"`
	IsActiveUserFollowing bool  `json:"isActiveUserFollowing"`
}

// @Summary Toggle follow/unfollow user
// @Description Toggle follow/unfollow user by user ID
// @Tags Profile
// @Accept  json
// @Produce  json
// @Param id path int64 true "User ID to follow/unfollow"
// @Success 200 {object} ToggleFollowResponse
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
	isActiveUserFollowing := (err == nil)

	if isActiveUserFollowing { // then unfollow
		deleteFollowerArg := db.DeleteFollowerParams{
			UserFromID: userID,
			UserToID:   userIDToFollow,
		}

		pc.Store.DeleteFollower(c, deleteFollowerArg)
		if err != nil {
			c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
			return
		}
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
	}

	numFollowers, err := pc.Store.GetNumFollowers(c, userIDToFollow)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
		return
	}

	toggleFollowResponse := ToggleFollowResponse{
		NumFollowers:          numFollowers,
		IsActiveUserFollowing: !isActiveUserFollowing,
	}

	c.JSON(http.StatusOK, toggleFollowResponse)
}

type FindUsersResponse struct {
	UsersWithIsActiveUserFollowing []UserWithIsActiveUserFollowing `json:"usersWithIsActiveUserFollowing"`
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
	limit, err := strconv.Atoi(c.Query("limit"))
	if err != nil {
		limit = pc.Env.DefaultLimitFindUsers
	}
	offset, _ := strconv.Atoi(c.Query("offset"))

	name := c.Param("name")

	findUsersByNicknameArgs := db.FindUsersByNicknameParams{
		Nickname: name,
		Limit:    (int32)(limit),
		Offset:   (int32)(offset),
	}

	foundUsers, err := pc.Store.FindUsersByNickname(c, findUsersByNicknameArgs)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
		return
	}

	findUsersResponse := FindUsersResponse{
		UsersWithIsActiveUserFollowing: make([]UserWithIsActiveUserFollowing, len(foundUsers)),
	}

	userID := c.GetInt64("userID")
	for i, foundUser := range foundUsers {
		getFollowerArg := db.GetFollowerParams{
			UserFromID: userID,
			UserToID:   foundUser.ID,
		}

		_, err = pc.Store.GetFollower(c, getFollowerArg)
		isActiveUserFollowing := (err == nil)

		findUsersResponse.UsersWithIsActiveUserFollowing[i] = UserWithIsActiveUserFollowing{
			User: User{
				UserID:    foundUser.ID,
				Nickname:  foundUser.Nickname,
				Fullname:  foundUser.Fullname,
				AvatarUrl: foundUser.AvatarUrl,
			},
			IsActiveUserFollowing: isActiveUserFollowing,
		}
	}

	c.JSON(http.StatusOK, findUsersResponse)
}
