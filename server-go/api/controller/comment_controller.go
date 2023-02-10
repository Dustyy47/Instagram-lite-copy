package controller

import (
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
	// var request AddCommentRequest

	// err := c.ShouldBind(&request)
	// if err != nil {
	// 	c.JSON(http.StatusBadRequest, errorResponse(err.Error()))
	// 	return
	// }

	// userID := c.GetInt64("userID")
	// user, err := cc.Store.GetUserByID(c, userID)
	// if err != nil {
	// 	c.JSON(http.StatusInternalServerError, errorResponse("Server error"))
	// 	return
	// }

	// postID, err := strconv.ParseInt(c.Params.ByName("postID"), 10, 64)
	// if err != nil {
	// 	c.JSON(http.StatusNotFound, errorResponse("Post not found by postID: "+c.Params.ByName("postID")))
	// 	return
	// }

	// post, err := cc.Store.GetPostByID(c, postID)
	// if err != nil {
	// 	c.JSON(http.StatusNotFound, errorResponse("Post not found by postID"))
	// 	return
	// }

	// //TODO:	Different date and time format is needed
	// createdAt := time.Time.UTC().Nanosecond() //primitive.Timestamp{T: uint32(time.Now().Unix())}
	// comment := db.Comment{
	// 	ID:   primitive.NewObjectID(),
	// 	Text: request.Text,

	// 	Author: user.ID,
	// 	PostID: post.ID,

	// 	CreatedAt: createdAt,
	// 	UpdatedAt: createdAt,
	// }

	// commentIDHex, err := cc.CommentUsecase.Create(c, &comment)
	// if err != nil {
	// 	c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
	// 	return
	// }

	// comment.ID = commentIDHex

	// post, err = cc.Store.GetByIDAndUpdate(c, bson.M{"_id": post.ID}, bson.D{{"$push", bson.D{{"comments", comment.ID}}}})
	// if err != nil {
	// 	c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
	// 	return
	// }

	// addCommentResponce := domain.AddCommentResponce(comment)

	// c.JSON(http.StatusOK, addCommentResponce)
}
