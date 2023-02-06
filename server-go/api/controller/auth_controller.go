package controller

import (
	"github.com/gin-gonic/gin"

	"app/bootstrap"
	"app/domain"
)

type AuthController struct {
	UserUsecase domain.UserUsecase
	Env         *bootstrap.Env
}

// TODO: validation
func (ac *AuthController) Register(c *gin.Context) {
	// 	var request domain.RegisterRequest

	// 	err := c.ShouldBind(&request)
	// 	if err != nil {
	// 		c.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: err.Error()})
	// 		return
	// 	}

	// 	_, err = ac.UserUsecase.GetUserByEmail(c, request.Email)
	// 	if err == nil {
	// 		c.JSON(http.StatusConflict, domain.ErrorResponse{Message: "User already exists with the given email"})
	// 		return
	// 	}

	// 	_, err = ac.UserUsecase.GetUserByNickName(c, request.NickName)
	// 	if err == nil {
	// 		c.JSON(http.StatusConflict, domain.ErrorResponse{Message: "User already exists with the given nickName"})
	// 		return
	// 	}

	// 	encryptedPassword, err := bcrypt.GenerateFromPassword(
	// 		[]byte(request.Password),
	// 		bcrypt.DefaultCost,
	// 	)
	// 	if err != nil {
	// 		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
	// 		return
	// 	}

	// 	request.Password = string(encryptedPassword)

	// 	var millisecondsUTC string = strconv.FormatInt(time.Now().UTC().UnixNano()/1e6, 10)
	// 	avatarName := millisecondsUTC + "--" + request.AvatarImage.Filename

	// 	err = c.SaveUploadedFile(request.AvatarImage, "images/avatars/"+avatarName)
	// 	if err != nil {
	// 		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: "Failed to save the avatarImage on the server"})
	// 		return
	// 	}

	// 	ban := 0

	// 	user := domain.User{
	// 		ID:       ban,
	// 		Email:    request.Email,
	// 		FullName: request.FullName,
	// 		Password: request.Password,
	// 		NickName: request.NickName,

	// 		LikedPosts:    make([]int64, 0),
	// 		Subscribers:   make([]int64, 0),
	// 		Subscribes:    make([]int64, 0),
	// 		Conversations: make([]int64, 0),

	// 		AvatarURL: avatarName,
	// 	}

	// 	err = ac.UserUsecase.Create(c, &user)
	// 	if err != nil {
	// 		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
	// 		return
	// 	}

	// 	accessToken, err := ac.UserUsecase.CreateAccessToken(&user, ac.Env.AccessTokenSecret, ac.Env.AccessTokenExpiryHour)
	// 	if err != nil {
	// 		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
	// 		return
	// 	}

	// 	authResponse := domain.AuthResponse{
	// 		AccessToken: accessToken,
	// 	}

	// 	c.JSON(http.StatusOK, authResponse)
}

func (ac *AuthController) Login(c *gin.Context) {
	// var request domain.LoginRequest

	// err := c.ShouldBind(&request)
	// if err != nil {
	// 	c.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: err.Error()})
	// 	return
	// }

	// user, err := ac.UserUsecase.GetUserByEmail(c, request.Email)
	// if err != nil {
	// 	c.JSON(http.StatusNotFound, domain.ErrorResponse{Message: "User not found with the given email"})
	// 	return
	// }

	// if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(request.Password)) != nil {
	// 	c.JSON(http.StatusUnauthorized, domain.ErrorResponse{Message: "Invalid credentials"})
	// 	return
	// }

	// accessToken, err := ac.UserUsecase.CreateAccessToken(&user, ac.Env.AccessTokenSecret, ac.Env.AccessTokenExpiryHour)
	// if err != nil {
	// 	c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
	// 	return
	// }

	// authResponse := domain.AuthResponse{
	// 	AccessToken: accessToken,
	// }

	// c.JSON(http.StatusOK, authResponse)
}
