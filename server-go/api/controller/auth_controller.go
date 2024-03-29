package controller

import (
	"mime/multipart"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"

	"app/bootstrap"
	db "app/db/sqlc"
	"app/internal/util"

	_ "github.com/santosh/gingo/docs"
)

type AuthController struct {
	Store db.Store
	Env   *bootstrap.Env
}

type RegisterRequest struct {
	Email    string `form:"email" binding:"required,email"`
	Password string `form:"password" binding:"required,min=6,max=25"`
	Fullname string `form:"fullname" binding:"required,min=3,max=255"`
	Nickname string `form:"nickname" binding:"required,min=1,max=255"`

	AvatarImage *multipart.FileHeader `form:"avatarImage" binding:"required"`
}

type AuthResponse struct {
	AccessToken string `json:"accessToken"`
}

// @Summary Register
// @Description Register a new user with email, password, fullname, nickname, and avatar image
// @Tags Auth
// @Accept multipart/form-data
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
		logrus.Errorf("%d err: %w", http.StatusBadRequest, err.Error())
		c.JSON(http.StatusBadRequest, errorResponse(err.Error()))
		return
	}
	// Validate avatar image
	err = util.ValidateImage(request.AvatarImage)
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

	avatarName, err := util.SaveUploadedFile(c, request.AvatarImage, "images/avatars/")
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse("Error saving image"))
		return
	}

	createUserarg := db.CreateUserParams{
		Email:          request.Email,
		Fullname:       request.Fullname,
		HashedPassword: request.Password,
		Nickname:       request.Nickname,

		AvatarUrl: avatarName,
	}

	user, err := ac.Store.CreateUser(c, createUserarg)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
		return
	}

	accessToken, err := util.CreateAccessToken(&user, ac.Env.AccessTokenSecret, ac.Env.AccessTokenExpiryHour)
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
	Password string `form:"password" binding:"required,min=6,max=25"`
}

// @Summary Login
// @Description Authenticate a user with email and password
// @Tags Auth
// @Accept json
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
		c.JSON(http.StatusNotFound, errorResponse("Wrong login or password"))
		return
	}

	if err := util.CheckPassword(request.Password, user.HashedPassword); err != nil {
		logrus.Info(err)
		c.JSON(http.StatusUnauthorized, errorResponse("Wrong login or password"))
		return
	}

	accessToken, err := util.CreateAccessToken(&user, ac.Env.AccessTokenSecret, ac.Env.AccessTokenExpiryHour)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
		return
	}

	authResponse := AuthResponse{
		AccessToken: accessToken,
	}

	c.JSON(http.StatusOK, authResponse)
}
