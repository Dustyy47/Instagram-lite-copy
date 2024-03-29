package controller

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"

	"app/bootstrap"
	db "app/db/sqlc"
)

type CommentController struct {
	Store db.Store
	Env   *bootstrap.Env
}

type AddCommentRequest struct {
	Text string `form:"text" binding:"required"`
}

// @Summary Add a new comment
// @Description Add a new comment to a post
// @Tags Comments
// @Accept json
// @Produce json
// @Param postID path int true "Post ID"
// @Param text body AddCommentRequest true "Comment text"
// @Success 200 {object} db.Comment
// @Failure 400 {object} ErrorResponse
// @Failure 401 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /posts/{postID}/comments/create [post]
// @security ApiKeyAuth
func (cc *CommentController) Add(c *gin.Context) {
	var request AddCommentRequest
	err := c.ShouldBind(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, errorResponse(err.Error()))
		return
	}

	userID := c.GetInt64("userID")
	user, err := cc.Store.GetUserByID(c, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse("Server error"))
		return
	}

	postID, err := strconv.ParseInt(c.Params.ByName("postID"), 10, 64)
	if err != nil {
		c.JSON(http.StatusNotFound, errorResponse("Post not found by postID: "+c.Params.ByName("postID")))
		return
	}

	post, err := cc.Store.GetPostByID(c, postID)
	if err != nil {
		c.JSON(http.StatusNotFound, errorResponse("Post not found by postID"))
		return
	}

	createCommentArg := db.CreateCommentParams{
		PostID: post.ID,
		UserID: user.ID,
		Text:   request.Text,
	}

	createdComment, err := cc.Store.CreateComment(c, createCommentArg)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
		return
	}

	c.JSON(http.StatusOK, createdComment)
}

// @Summary Remove a comment by ID
// @Tags Comments
// @Param commentID path int64 true "Comment ID"
// @Success 200 {object} SuccessResponse
// @Failure 400 {object} ErrorResponse
// @Failure 403 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /posts/{postID}/comments/{commentID} [delete]
// @Security ApiKeyAuth
func (cc *CommentController) Remove(c *gin.Context) {
	var request struct{}

	err := c.ShouldBind(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, errorResponse(err.Error()))
		return
	}

	commentID, err := strconv.ParseInt(c.Params.ByName("commentID"), 10, 64)
	if err != nil {
		c.JSON(http.StatusNotFound, errorResponse("Comment not found"))
		return
	}

	comment, err := cc.Store.GetCommentByID(c, commentID)
	if err != nil {
		c.JSON(http.StatusNotFound, errorResponse("Comment not found"))
		return
	}

	userID := c.GetInt64("userID")

	if postedBy := comment.UserID; userID != postedBy {
		c.JSON(http.StatusForbidden, errorResponse("You don't have access"))
		return
	}

	err = cc.Store.DeleteComment(c, comment.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
		return
	}

	c.JSON(http.StatusOK, successResponse("Comment was removed"))
}

type GetCommentsOfPostResponse struct {
	CommentsWithLikes []CommentWithLike `json:"commentWithLikes"`
}

type CommentWithLike struct {
	Comment   `json:"comment"`
	NumLikes  int64 `json:"numLikes"`
	IsLikedMe bool  `json:"isLikedMe"`
}

type Comment struct {
	ID        int64     `json:"id"`
	PostID    int64     `json:"post_id"`
	Text      string    `json:"text"`
	CreatedAt time.Time `json:"created_at"`
	Author    `json:"author"`
}

// @Summary Get comments of a post
// @Description Get comments of a post with pagination
// @Tags Comments
// @Accept json
// @Produce json
// @Param postID path int64 true "Post ID"
// @Param limit query int32 false "Limit"
// @Param offset query int32 false "Offset"
// @Success 200 {object} GetCommentsOfPostResponse
// @Failure 400 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /posts/{postID}/comments [get]
// @Security ApiKeyAuth
func (cc *CommentController) GetCommentsOfPost(c *gin.Context) {
	postID, err := strconv.ParseInt(c.Params.ByName("postID"), 10, 64)
	if err != nil {
		c.JSON(http.StatusNotFound, errorResponse("Post not found with the given postID"))
		return
	}

	limit, err := strconv.Atoi(c.Query("limit"))
	if err != nil {
		limit = cc.Env.DefaultLimitGetCommentsOfPost
	}
	offset, _ := strconv.Atoi(c.Query("offset"))

	listCommentsOfPostArg := db.ListCommentsOfPostParams{
		PostID: postID,
		Limit:  (int32)(limit),
		Offset: (int32)(offset),
	}

	comments, err := cc.Store.ListCommentsOfPost(c, listCommentsOfPostArg)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
		return
	}

	getCommentsOfPostResponse := GetCommentsOfPostResponse{
		CommentsWithLikes: make([]CommentWithLike, len(comments)),
	}

	userID := c.GetInt64("userID")

	for i, comment := range comments {
		authorComment, err := cc.Store.GetUserByID(c, comment.UserID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
			return
		}

		author := Author{
			UserID:    authorComment.ID,
			Nickname:  authorComment.Nickname,
			Fullname:  authorComment.Fullname,
			AvatarUrl: authorComment.AvatarUrl,
		}

		numLikes, err := cc.Store.GetNumLikesComment(c, comment.ID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
			return
		}

		isLikedMe := false

		getLikeCommentArg := db.GetLikedCommentParams{
			CommentID: comment.ID,
			UserID:    userID,
		}
		_, err = cc.Store.GetLikedComment(c, getLikeCommentArg)
		// if err = nil => user liked this comment
		if err == nil {
			isLikedMe = true
		}

		getCommentsOfPostResponse.CommentsWithLikes[i] = CommentWithLike{
			Comment: Comment{
				ID:        comment.ID,
				PostID:    comment.PostID,
				Text:      comment.Text,
				CreatedAt: comment.CreatedAt,
				Author:    author,
			},
			NumLikes:  numLikes,
			IsLikedMe: isLikedMe,
		}
	}

	c.JSON(http.StatusOK, getCommentsOfPostResponse)
}

// @Summary Like or dislike a comment
// @Tags Comments
// @Accept json
// @Produce json
// @Param commentID path int64 true "Comment ID"
// @Success 200 {object} LikeResponse "Number of likes and isLikedMe"
// @Failure 400 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /posts/{postID}/comments/{commentID}/like [put]
// @Security ApiKeyAuth
func (cc *CommentController) Like(c *gin.Context) {
	commentID, err := strconv.ParseInt(c.Params.ByName("commentID"), 10, 64)
	if err != nil {
		c.JSON(http.StatusNotFound, errorResponse(err.Error()))
		return
	}

	comment, err := cc.Store.GetCommentByID(c, commentID)
	if err != nil {
		c.JSON(http.StatusNotFound, errorResponse(err.Error()))
		return
	}

	userID := c.GetInt64("userID")

	getLikedCommentArg := db.GetLikedCommentParams{
		CommentID: comment.ID,
		UserID:    userID,
	}

	var likeRespose LikeResponse

	_, err = cc.Store.GetLikedComment(c, getLikedCommentArg)
	if err != nil {
		likeCommentArg := db.LikeCommentParams{
			CommentID: comment.ID,
			UserID:    userID,
		}

		err := cc.Store.LikeComment(c, likeCommentArg)
		if err != nil {
			c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
			return
		}

		likeRespose.IsActiveUserLiked = true
	} else {
		dislikeCommentArg := db.DislikeCommentParams{
			CommentID: comment.ID,
			UserID:    userID,
		}

		err := cc.Store.DislikeComment(c, dislikeCommentArg)
		if err != nil {
			c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
			return
		}

		likeRespose.IsActiveUserLiked = false
	}

	numLikes, err := cc.Store.GetNumLikesComment(c, comment.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
		return
	}
	likeRespose.NumLikes = numLikes

	c.JSON(http.StatusOK, likeRespose)
}
