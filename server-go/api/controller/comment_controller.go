package controller

import (
	"github.com/gin-gonic/gin"

	"app/bootstrap"
	"app/domain"
)

type CommentController struct {
	CommentUsecase domain.CommentUsecase
	PostUsecase    domain.PostUsecase
	UserUsecase    domain.UserUsecase

	Env *bootstrap.Env
}

func (cc *CommentController) Add(c *gin.Context) {
	// var request domain.AddCommentRequest

	// err := c.ShouldBind(&request)
	// if err != nil {
	// 	c.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: err.Error()})
	// 	return
	// }

	// userID := c.GetString("userID")
	// user, err := cc.UserUsecase.GetByID(c, userID)
	// if err != nil {
	// 	c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: "server error"})
	// 	return
	// }

	// postID := c.Params.ByName("postID")
	// post, err := cc.PostUsecase.GetByID(c, postID)
	// if err != nil {
	// 	c.JSON(http.StatusNotFound, domain.ErrorResponse{Message: "post not found by postID"})
	// 	return
	// }

	//TODO:	Different date and time format is needed
	// createdAt := time.Time.UTC().Nanosecond()//primitive.Timestamp{T: uint32(time.Now().Unix())}
	// comment := domain.Comment{
	// 	ID:   primitive.NewObjectID(),
	// 	Text: request.Text,

	// 	Author: user.ID,
	// 	PostID: post.ID,

	// 	CreatedAt: createdAt,
	// 	UpdatedAt: createdAt,
	// }

	// commentIDHex, err := cc.CommentUsecase.Create(c, &comment)
	// if err != nil {
	// 	c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
	// 	return
	// }

	// comment.ID = commentIDHex

	// post, err = cc.PostUsecase.GetByIDAndUpdate(c, bson.M{"_id": post.ID}, bson.D{{"$push", bson.D{{"comments", comment.ID}}}})
	// if err != nil {
	// 	c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
	// 	return
	// }

	// addCommentResponce := domain.AddCommentResponce(comment)

	// c.JSON(http.StatusOK, addCommentResponce)
}
