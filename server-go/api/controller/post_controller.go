package controller

import (
	"mime/multipart"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"app/bootstrap"
	db "app/db/sqlc"
	"app/internal/util"
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

	imgName, err := util.SaveUploadedFile(c, request.Img, "images/")
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
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

	err = util.RemoveFileFromServer("images/" + post.ImageUrl)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
		return
	}
	err = pc.Store.DeletePost(c, post.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
		return
	}

	c.JSON(http.StatusOK, successResponse("Post was removed"))
}

type GetPostsByUserResponse struct {
	PostsWithLikes []PostWithLike `json:"postsWithLikes"`
}

type PostWithLike struct {
	db.Post   `json:"post"`
	NumLikes  int64 `json:"numLikes"`
	IsLikedMe bool  `json:"isLikedMe"`
}

// @Summary Get posts by user
// @Description Get posts by user with pagination
// @Tags Posts
// @Param userID path int64 true "User ID"
// @Param limit query int false "Limit"
// @Param offset query int false "Offset"
// @Success 200 {object} GetPostsByUserResponse
// @Failure 400 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /posts/userID/{userID} [get]
// @security ApiKeyAuth
func (pc *PostController) GetPostsByUser(c *gin.Context) {
	limit, err := strconv.Atoi(c.Query("limit"))
	if err != nil {
		limit = pc.Env.DefaultLimitGetPostsByUser
	}
	offset, _ := strconv.Atoi(c.Query("offset"))

	authorID, err := strconv.ParseInt(c.Params.ByName("userID"), 10, 64)
	if err != nil {
		c.JSON(http.StatusNotFound, errorResponse("User not found with the given userID"))
		return
	}

	author, err := pc.Store.GetUserByID(c, authorID)
	if err != nil {
		c.JSON(http.StatusNotFound, errorResponse("User not found with the given userID"))
		return
	}

	listPostOfUserArg := db.ListPostOfUserParams{
		UserID: author.ID,
		Limit:  (int32)(limit),
		Offset: (int32)(offset),
	}

	posts, err := pc.Store.ListPostOfUser(c, listPostOfUserArg)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
		return
	}

	getPostsByUserResponse := GetPostsByUserResponse{
		PostsWithLikes: make([]PostWithLike, len(posts)),
	}

	userID := c.GetInt64("userID")

	for i, post := range posts {
		numLikes, err := pc.Store.GetNumLikesPost(c, post.ID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
			return
		}

		isLikedMe := false

		getLikePostArg := db.GetLikedPostParams{
			PostID: post.ID,
			UserID: userID,
		}
		_, err = pc.Store.GetLikedPost(c, getLikePostArg)
		// if err = nil => user liked this post
		if err == nil {
			isLikedMe = true
		}

		getPostsByUserResponse.PostsWithLikes[i] = PostWithLike{
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
// @Success 200 {object} LikeResponse
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

		likeRespose.IsActiveUserLiked = true
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

		likeRespose.IsActiveUserLiked = false
	}

	numLikes, err := pc.Store.GetNumLikesPost(c, post.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
		return
	}
	likeRespose.NumLikes = numLikes

	c.JSON(http.StatusOK, likeRespose)
}
