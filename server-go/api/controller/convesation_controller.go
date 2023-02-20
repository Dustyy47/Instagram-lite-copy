package controller

import (
	"app/bootstrap"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/sirupsen/logrus"

	db "app/db/sqlc"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type ConversationController struct {
	Store db.Store
	Env   *bootstrap.Env
}

type CreateConversationRequest struct {
	SecondUserID int64 `form:"secondUserID" binding:"required"`
}

type CreateConversationResponce struct {
	ConversationID int64 `json:"conversationID"`
}

func (cc *ConversationController) Create(c *gin.Context) {
	var request CreateConversationRequest

	err := c.ShouldBind(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, errorResponse(err.Error()))
		return
	}

	userID := c.GetInt64("userID")

	_, err = cc.Store.GetUserByID(c, userID)
	if err != nil {
		c.JSON(http.StatusNotAcceptable, "You don't have access")
		return
	}

	_, err = cc.Store.GetUserByID(c, request.SecondUserID)
	if err != nil {
		c.JSON(http.StatusBadRequest, fmt.Sprintf("User not exist by id: %d", request.SecondUserID))
		return
	}

	createConversationArg := db.CreateConversationParams{
		UserFirstID:  userID,
		UserSecondID: request.SecondUserID,
	}

	createdConversation, err := cc.Store.CreateConversation(c, createConversationArg)
	if err != nil {
		c.JSON(http.StatusInternalServerError, errorResponse(err.Error()))
		return
	}

	c.JSON(http.StatusOK, createdConversation.ID)
}

type message struct {
	UserID    int64     `json:"userID"`
	Text      string    `json:"text"`
	CreatedAt time.Time `json:"createdAt"`
}

func (cc *ConversationController) Run(c *gin.Context) {
	conversationID, err := strconv.ParseInt(c.Param("conversationID"), 10, 64)
	if err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	_, err = cc.Store.GetConverstionByID(c, conversationID)
	if err != nil {
		c.JSON(http.StatusBadRequest, fmt.Sprintf("Conversation not found by id: %d", conversationID))
		return
	}

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Printf("Failed to upgrade to websockets: %v", err)
		return
	}

	ch := make(chan message)

	go func() {
		for {
			msg := <-ch
			if err := conn.WriteJSON(msg); err != nil {
				log.Printf("Failed to write message to websocket: %v", err)
				break
			}
		}
	}()

	go func() {
		messages, err := cc.Store.ListMessgesOfConversation(c, db.ListMessgesOfConversationParams{
			ConversationID: conversationID,
			Limit:          100,
			Offset:         0,
		})
		if err != nil {
			logrus.Printf("Failed to read messages from database: %v", err)
			return
		}

		for i := len(messages) - 1; i >= 0; i-- {
			msg := message{
				UserID:    messages[i].UserID,
				Text:      messages[i].Text,
				CreatedAt: messages[i].CreatedAt,
			}
			ch <- msg
		}
	}()

	for {
		var msg message
		if err := conn.ReadJSON(&msg); err != nil {
			logrus.Printf("Failed to read message from websocket: %v", err)
			break
		}

		createMessageArg := db.CreateMessageParams{
			ConversationID: conversationID,
			UserID:         msg.UserID,
			Text:           msg.Text,
		}

		createdMessage, err := cc.Store.CreateMessage(c, createMessageArg)
		if err != nil {
			logrus.Printf("Failed to create message to db: %v", err)
			break
		}

		updateLastMsgOfConversationArg := db.UpdateLastMsgOfConversationParams{
			ID:               conversationID,
			LastMsgCreatedAt: createdMessage.CreatedAt,
		}

		err = cc.Store.UpdateLastMsgOfConversation(c, updateLastMsgOfConversationArg)
		if err != nil {
			logrus.Printf("Failed to update last message of conversation: %v", err)
		}

		msg = message{
			UserID:    createdMessage.UserID,
			Text:      createdMessage.Text,
			CreatedAt: createdMessage.CreatedAt,
		}
		ch <- msg
	}
}
