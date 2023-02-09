package controller

import (
	"database/sql"
	"mime/multipart"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"

	"app/bootstrap"
	db "app/db/sqlc"
	"app/internal/tokenutil"
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

// TODO: validation
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
		c.JSON(http.StatusConflict, errorResponse("User already exists with the given nickName"))
		return
	}

	encryptedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(request.Password),
		bcrypt.DefaultCost,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
		return
	}

	request.Password = string(encryptedPassword)

	var millisecondsUTC string = strconv.FormatInt(time.Now().UTC().UnixNano()/1e6, 10)
	avatarName := millisecondsUTC + "--" + request.AvatarImage.Filename

	err = c.SaveUploadedFile(request.AvatarImage, "images/avatars/"+avatarName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse("Failed to save the avatarImage on the server"))
		return
	}

	arg := db.CreateUserParams{
		Email:          request.Email,
		Fullname:       request.Fullname,
		HashedPassword: request.Password,
		Nickname:       request.Nickname,

		AvatarUrl: sql.NullString{String: avatarName, Valid: true},
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

	if bcrypt.CompareHashAndPassword([]byte(user.HashedPassword), []byte(request.Password)) != nil {
		c.JSON(http.StatusUnauthorized, errorResponse("Invalid credentials"))
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
