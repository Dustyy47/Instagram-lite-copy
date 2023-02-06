package repository

import (
	"context"

	"app/domain"
	"app/driverdb"
)

type postRepository struct {
	database   *driverdb.DB
	collection string
}

func NewPostRepository(db *driverdb.DB, collection string) domain.PostRepository {
	return &postRepository{
		database:   db,
		collection: collection,
	}
}

func (pr *postRepository) Create(c context.Context, post *domain.Post) error {
	// collection := pr.database.Collection(pr.collection)

	// _, err := collection.InsertOne(c, post)

	return nil
}

func (pr *postRepository) Remove(c context.Context, post *domain.Post) error {
	// collection := pr.database.Collection(pr.collection)

	// _, err := collection.DeleteOne(c, post)

	return nil
}

func (pr *postRepository) GetByIDAndUpdate(c context.Context) (domain.Post, error) {
	// collection := pr.database.Collection(pr.collection)

	// opts := options.FindOneAndUpdate().SetReturnDocument(options.After)

	// var post domain.Post
	// err := collection.FindOneAndUpdate(c, filter, update, opts).Decode(&post)

	return domain.Post{}, nil
}

func (pr *postRepository) GetByID(c context.Context, id string) (domain.Post, error) {
	// collection := pr.database.Collection(pr.collection)

	// var post domain.Post

	// idHex, err := primitive.ObjectIDFromHex(id)
	// if err != nil {
	// 	return post, err
	// }

	// err = collection.FindOne(c, bson.M{"_id": idHex}).Decode(&post)
	return domain.Post{}, nil
}

func (pr *postRepository) GetAllPostedByUser(c context.Context, userID string) ([]domain.Post, error) {
	// collection := pr.database.Collection(pr.collection)

	// userIDHex, err := primitive.ObjectIDFromHex(userID)
	// if err != nil {
	// 	return make([]domain.Post, 0), err
	// }

	// cursor, err := collection.Find(c, userIDHex)
	// if err != nil {
	// 	return make([]domain.Post, 0), err
	// }

	// var posts []domain.Post
	// err = cursor.Decode(&posts)
	// if err != nil {
	// 	return make([]domain.Post, 0), err
	// }

	return []domain.Post{}, nil
}
