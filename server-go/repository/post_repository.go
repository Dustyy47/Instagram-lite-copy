package repository

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/Dustyy47/Instagram-lite-copy/server-go/domain"
	"github.com/Dustyy47/Instagram-lite-copy/server-go/mongo"
)

type postRepository struct {
	database   mongo.Database
	collection string
}

func NewPostRepository(db mongo.Database, collection string) domain.PostRepository {
	return &postRepository{
		database:   db,
		collection: collection,
	}
}

func (pr *postRepository) Create(c context.Context, post *domain.Post) error {
	collection := pr.database.Collection(pr.collection)

	_, err := collection.InsertOne(c, post)

	return err
}

func (pr *postRepository) Remove(c context.Context, post *domain.Post) error {
	collection := pr.database.Collection(pr.collection)

	_, err := collection.DeleteOne(c, post)

	return err
}

func (pr *postRepository) GetByIDAndUpdate(c context.Context, id string, opts ...*options.UpdateOptions) (domain.Post, error) {
	collection := pr.database.Collection(pr.collection)

	_, err := collection.UpdateOne(c, id, opts)

	if err != nil {
		return domain.Post{}, err
	}

	return pr.GetByID(c, id)
}

func (pr *postRepository) GetByID(c context.Context, id string) (domain.Post, error) {
	collection := pr.database.Collection(pr.collection)

	var post domain.Post

	idHex, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return post, err
	}

	err = collection.FindOne(c, bson.M{"_id": idHex}).Decode(&post)
	return post, err
}
