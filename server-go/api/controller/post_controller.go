package controller

import (
	"mime/multipart"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"

	"app/bootstrap"
	db "app/db/sqlc"
)

type PostController struct {
	Store db.Store
	Env   *bootstrap.Env
}

type AddPostRequest struct {
	Title       string `form:"title" binding:""`
	Description string `form:"description" binding:""`

	Img *multipart.FileHeader `form:"img" binding:"required"`
}

func (pc *PostController) Add(c *gin.Context) {
	var request AddPostRequest

	err := c.ShouldBind(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, errorResponse(err.Error()))
		return
	}

	var millisecondsUTC string = strconv.FormatInt(time.Now().UTC().UnixNano()/1e6, 10)
	imgName := millisecondsUTC + "--" + request.Img.Filename

	err = c.SaveUploadedFile(request.Img, "images/"+imgName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse("Failed to save the avatarImage on the server"))
		return
	}

	userID := c.GetInt64("userID")

	createPostArg := db.CreatePostParams{
		UserID:      userID,
		Title:       request.Title,
		Description: request.Description,
		ImageUrl:    imgName,
	}

	createdPost, err := pc.Store.CreatePost(c, createPostArg)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
		return
	}

	c.JSON(http.StatusOK, createdPost)
}

func (pc *PostController) Remove(c *gin.Context) {
	var request struct{}

	err := c.ShouldBind(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, errorResponse(err.Error()))
		return
	}

	postID, err := strconv.ParseInt(c.Params.ByName("postID"), 10, 64)
	if err != nil {
		c.JSON(http.StatusNotFound, errorResponse("Post not found"))
		return
	}

	post, err := pc.Store.GetPostByID(c, postID)
	if err != nil {
		c.JSON(http.StatusNotFound, errorResponse("Post not found"))
		return
	}

	userID := c.GetInt64("userID")
	if postedBy := post.UserID; userID != postedBy {
		c.JSON(http.StatusForbidden, errorResponse("You don't have access"))
		return
	}

	err = pc.Store.DeletePost(c, post.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
		return
	}

	c.JSON(http.StatusOK, successResponce("Post was removed"))
}

type GetPostsByUserRequest struct {
	UserID   int64  `form:"userID" binding:"required"`
	Nickname string `form:"nickname" binding:"required"`
	Limit    int32  `form:"limit" binding:"required"`
	Offset   int32  `form:"offset" binding:"required"`
}

func (pc *PostController) GetPostsByUser(c *gin.Context) {
	var request GetPostsByUserRequest

	err := c.ShouldBind(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, errorResponse(err.Error()))
		return
	}

	user, err := pc.Store.GetUserByID(c, request.UserID)
	if err != nil {
		user, err = pc.Store.GetUserByNickname(c, request.Nickname)
		if err != nil {
			c.JSON(http.StatusNotFound, errorResponse("User not found with the given userID or nickName"))
			return
		}
	}

	listPostOfUserArg := db.ListPostOfUserParams{
		UserID: user.ID,
		Limit:  request.Limit,
		Offset: request.Offset,
	}

	posts, err := pc.Store.ListPostOfUser(c, listPostOfUserArg)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
		return
	}

	c.JSON(http.StatusOK, posts)
}

func (pc *PostController) Like(c *gin.Context) {
	var request struct{}

	err := c.ShouldBind(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, errorResponse(err.Error()))
		return
	}

	postID, err := strconv.ParseInt(c.Params.ByName("postID"), 10, 64)
	if err != nil {
		c.JSON(http.StatusNotFound, errorResponse(err.Error()))
		return
	}

	post, err := pc.Store.GetPostByID(c, postID)
	if err != nil {
		c.JSON(http.StatusNotFound, errorResponse(err.Error()))
		return
	}

	userID := c.GetInt64("userID")

	getLikePostArg := db.GetLikedPostParams{
		PostID: post.ID,
		UserID: userID,
	}

	_, err = pc.Store.GetLikedPost(c, getLikePostArg)
	if err != nil {
		likePostArg := db.LikePostParams{
			PostID: post.ID,
			UserID: userID,
		}

		err := pc.Store.LikePost(c, likePostArg)
		if err != nil {
			c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
			return
		}
	} else {
		dislikePostParams := db.DislikePostParams{
			PostID: post.ID,
			UserID: userID,
		}

		err := pc.Store.DislikePost(c, dislikePostParams)
		if err != nil {
			c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
			return
		}
	}

	numberLikes, err := pc.Store.GetNumLikesPost(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
		return
	}

	c.JSON(http.StatusOK, numberLikes)
}
