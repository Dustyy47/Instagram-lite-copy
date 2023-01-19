package controller

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/Dustyy47/Instagram-lite-copy/server-go/bootstrap"
	"github.com/Dustyy47/Instagram-lite-copy/server-go/domain"
)

type PostController struct {
	PostUsecase domain.PostUsecase

	Env *bootstrap.Env
}

func (pc *PostController) Add(c *gin.Context) {
	var request domain.AddPostRequest

	err := c.ShouldBind(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: err.Error()})
		return
	}

	var millisecondsUTC string = strconv.FormatInt(time.Now().UTC().UnixNano()/1e6, 10)
	imgName := millisecondsUTC + "--" + request.Img.Filename

	err = c.SaveUploadedFile(request.Img, "images/"+imgName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: "Failed to save the avatarImage on the server"})
		return
	}

	userID := c.GetString("userID")
	userIDHex, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	post := domain.Post{
		ID:          primitive.NewObjectID(),
		Title:       request.Title,
		Discription: request.Description,

		Likes:    make([]primitive.ObjectID, 0),
		PostedBy: userIDHex,

		Comments: make([]primitive.ObjectID, 0),

		ImageURL: imgName,
	}

	err = pc.PostUsecase.Create(c, &post)
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}

	addPostResponce := domain.AddPostResponce(post)

	c.JSON(http.StatusOK, addPostResponce)
}

func (pc *PostController) Remove(c *gin.Context) {
	var request domain.DeletePostRequest

	err := c.ShouldBind(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: err.Error()})
		return
	}

	postID := c.Params.ByName("postID")
	post, err := pc.PostUsecase.GetByID(c, postID)
	if err != nil {
		c.JSON(http.StatusNotFound, domain.ErrorResponse{Message: "Post not found"})
		return
	}

	userID := c.GetString("userID")
	if postedBy := post.PostedBy.Hex(); userID != postedBy {
		c.JSON(http.StatusForbidden, domain.ErrorResponse{Message: "You don't have access"})
		return
	}

	err = pc.PostUsecase.Remove(c, &post)
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}

	successResponce := domain.SuccessResponse{Message: "Post was removed"}

	c.JSON(http.StatusOK, successResponce)
}
