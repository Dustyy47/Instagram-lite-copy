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

// @Summary Add a new post
// @Tags Posts
// @Accept multipart/form-data
// @Param title formData string false "Title of the post"
// @Param description formData string false "Description of the post"
// @Param img formData file true "Image of the post"
// @Success 200 {object} db.Post
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /posts/create [post]
// @security ApiKeyAuth
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

// @Summary Remove a post by ID
// @Tags Posts
// @Param postID path int64 true "Post ID"
// @Success 200 {object} SuccessResponse
// @Failure 400 {object} ErrorResponse
// @Failure 403 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /posts/{postID} [delete]
// @security ApiKeyAuth
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

	c.JSON(http.StatusOK, successResponse("Post was removed"))
}

type GetPostsByUserRequest struct {
	UserID   int64  `form:"userID" binding:"required"`
	Nickname string `form:"nickname" binding:"required"`
	Limit    int32  `form:"limit" binding:"min=0"`
	Offset   int32  `form:"offset" binding:"min=0"`
}

type PostWithLikes struct {
	db.Post   `json:"post"`
	NumLikes  int64 `json:"numLikes"`
	IsLikedMe bool  `json:"isLikedMe"`
}

type GetPostsByUserResponse struct {
	PostWithLikes []PostWithLikes `json:"postWithLikes"`
}

// @Summary Get posts by user
// @Description Get posts by user with pagination
// @Tags Posts
// @Param userID query int64 true "User ID"
// @Param nickname query string true "User nickname"
// @Param limit query int false "Limit"
// @Param offset query int false "Offset"
// @Success 200 {object} GetPostsByUserResponse "List of posts with number likes and isLikedMe"
// @Failure 400 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /posts/ [get]
// @security ApiKeyAuth
func (pc *PostController) GetPostsByUser(c *gin.Context) {
	var request GetPostsByUserRequest
	err := c.ShouldBind(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, errorResponse(err.Error()))
		return
	}

	if request.Limit == 0 {
		request.Limit = pc.Env.DefaultLimitGetPostsByUser
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

	getPostsByUserResponse := GetPostsByUserResponse{
		PostWithLikes: make([]PostWithLikes, len(posts)),
	}

	for i, post := range posts {
		numLikes, err := pc.Store.GetNumLikesPost(c, post.ID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
			return
		}

		isLikedMe := false

		userID := c.GetInt64("userID")

		getLikePostArg := db.GetLikedPostParams{
			PostID: post.ID,
			UserID: userID,
		}
		_, err = pc.Store.GetLikedPost(c, getLikePostArg)
		// if err = nil => user liked this post
		if err == nil {
			isLikedMe = true
		}

		getPostsByUserResponse.PostWithLikes[i] = PostWithLikes{
			Post:      post,
			NumLikes:  numLikes,
			IsLikedMe: isLikedMe,
		}
	}

	c.JSON(http.StatusOK, getPostsByUserResponse)
}

// @Summary Like or dislike a post
// @Tags Posts
// @Param postID path int true "Post ID"
// @Success 200 {object} LikeResponse "Number of likes and isLikedMe"
// @Failure 400 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /posts/{postID}/like [put]
// @security ApiKeyAuth
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

	var likeRespose LikeResponse

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

		likeRespose.IsLikedMe = true
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

		likeRespose.IsLikedMe = false
	}

	numLikes, err := pc.Store.GetNumLikesPost(c, post.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
		return
	}
	likeRespose.NumLikes = numLikes

	c.JSON(http.StatusOK, likeRespose)
}
