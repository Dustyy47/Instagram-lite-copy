package controller

import (
	"net/http"
	"strconv"

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

	c.JSON(http.StatusOK, successResponce("Comment was removed"))
}

type GetCommentOfPostRequest struct {
	PostID int64 `form:"postID" binding:"required"`
	Limit  int32 `form:"limit" binding:"required"`
	Offset int32 `form:"offset" binding:"required"`
}

func (cc *CommentController) GetCommentsOfPost(c *gin.Context) {
	var request GetCommentOfPostRequest

	err := c.ShouldBind(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, errorResponse(err.Error()))
		return
	}

	listCommentsOfPostArg := db.ListCommentsOfPostParams{
		PostID: request.PostID,
		Limit:  request.Limit,
		Offset: request.Offset,
	}

	posts, err := cc.Store.ListCommentsOfPost(c, listCommentsOfPostArg)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
		return
	}

	c.JSON(http.StatusOK, posts)
}

func (cc *CommentController) Like(c *gin.Context) {
	var request struct{}

	err := c.ShouldBind(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, errorResponse(err.Error()))
		return
	}

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
	}

	numberLikes, err := cc.Store.GetNumLikesComment(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
		return
	}

	c.JSON(http.StatusOK, numberLikes)
}
