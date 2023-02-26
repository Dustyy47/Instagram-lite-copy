package controller

import (
	"mime/multipart"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"

	"app/bootstrap"
	db "app/db/sqlc"
	"app/internal/tokenutil"
	"app/internal/util"

	_ "github.com/santosh/gingo/docs"
)

type AuthController struct {
	Store db.Store
	Env   *bootstrap.Env
}

type RegisterRequest struct {
	Email    string `form:"email" binding:"required,email"`
	Password string `form:"password" binding:"required"`
	Fullname string `form:"fullname" binding:"required"`
	Nickname string `form:"nickname" binding:"required"`

	AvatarImage *multipart.FileHeader `form:"avatarImage" binding:"required"`
}

type AuthResponse struct {
	AccessToken string `json:"accessToken"`
}

// @Summary Register
// @Description Register a new user with email, password, fullname, nickname, and avatar image
// @Tags Auth
// @Accept mpfd
// @Produce json
// @Param email formData string true "Email address of the user"
// @Param password formData string true "Password for the user account"
// @Param fullname formData string true "Full name of the user"
// @Param nickname formData string true "Nickname of the user"
// @Param avatarImage formData file true "Avatar image for the user"
// @Success 200 {object} AuthResponse
// @Failure 400 {object} ErrorResponse
// @Failure 409 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /auth/registration [post]
func (ac *AuthController) Register(c *gin.Context) {
	var request RegisterRequest
	err := c.ShouldBind(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, errorResponse(err.Error()))
		return
	}

	_, err = ac.Store.GetUserByEmail(c, request.Email)
	if err == nil {
		c.JSON(http.StatusConflict, errorResponse("User already exists with the given email"))
		return
	}

	_, err = ac.Store.GetUserByNickname(c, request.Nickname)
	if err == nil {
		c.JSON(http.StatusConflict, errorResponse("User already exists with the given nickname"))
		return
	}

	hashedPassword, err := util.HashPassword(request.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
		return
	}

	request.Password = string(hashedPassword)

	var millisecondsUTC string = strconv.FormatInt(time.Now().UTC().UnixNano()/1e6, 10)
	avatarName := millisecondsUTC + "--" + request.AvatarImage.Filename

	err = c.SaveUploadedFile(request.AvatarImage, "images/avatars/"+avatarName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse("Error saving avatar image"))
		return
	}

	arg := db.CreateUserParams{
		Email:          request.Email,
		Fullname:       request.Fullname,
		HashedPassword: request.Password,
		Nickname:       request.Nickname,

		AvatarUrl: avatarName,
	}

	user, err := ac.Store.CreateUser(c, arg)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
		return
	}

	accessToken, err := tokenutil.CreateAccessToken(&user, ac.Env.AccessTokenSecret, ac.Env.AccessTokenExpiryHour)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
		return
	}

	authResponse := AuthResponse{
		AccessToken: accessToken,
	}

	c.JSON(http.StatusOK, authResponse)
}

type LoginRequest struct {
	Email    string `form:"email" binding:"required,email"`
	Password string `form:"password" binding:"required"`
}

// @Summary Login
// @Description Authenticate a user with email and password
// @Tags Auth
// @Accept mpfd
// @Produce json
// @Param email formData string true "Email address of the user"
// @Param password formData string true "Password for the user account"
// @Success 200 {object} AuthResponse
// @Failure 400 {object} ErrorResponse
// @Failure 401 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /auth/login [post]
func (ac *AuthController) Login(c *gin.Context) {
	var request LoginRequest

	err := c.ShouldBind(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, errorResponse(err.Error()))
		return
	}

	user, err := ac.Store.GetUserByEmail(c, request.Email)
	if err != nil {
		c.JSON(http.StatusNotFound, errorResponse("User not found with the given email"))
		return
	}

	if err := util.CheckPassword(request.Password, user.HashedPassword); err != nil {
		c.JSON(http.StatusUnauthorized, errorResponse(err.Error()))
		return
	}

	accessToken, err := tokenutil.CreateAccessToken(&user, ac.Env.AccessTokenSecret, ac.Env.AccessTokenExpiryHour)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
		return
	}

	authResponse := AuthResponse{
		AccessToken: accessToken,
	}

	c.JSON(http.StatusOK, authResponse)
}
