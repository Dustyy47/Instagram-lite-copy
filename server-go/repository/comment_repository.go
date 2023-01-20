package repository

import (
	"context"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/Dustyy47/Instagram-lite-copy/server-go/domain"
	"github.com/Dustyy47/Instagram-lite-copy/server-go/mongo"
)

type commentRepository struct {
	database   mongo.Database
	collection string
}

func NewCommentRepository(db mongo.Database, collection string) domain.CommentRepository {
	return &commentRepository{
		database:   db,
		collection: collection,
	}
}

func (cr *commentRepository) Create(c context.Context, comment *domain.Comment) (primitive.ObjectID, error) {
	collection := cr.database.Collection(cr.collection)
	return collection.InsertOne(c, comment)
}

func (cr *commentRepository) GetAllPostedOnPostID(c context.Context, userID string) ([]domain.Comment, error) {
	collection := cr.database.Collection(cr.collection)

	userIDHex, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return make([]domain.Comment, 0), err
	}

	cursor, err := collection.Find(c, userIDHex)
	if err != nil {
		return make([]domain.Comment, 0), err
	}

	var posts []domain.Comment
	err = cursor.Decode(&posts)
	if err != nil {
		return make([]domain.Comment, 0), err
	}

	return posts, err
}
