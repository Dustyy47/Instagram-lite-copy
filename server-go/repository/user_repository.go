package repository

import (
	"context"

	"app/domain"
	"app/driverdb"
)

type userRepository struct {
	database   *driverdb.DB
	collection string
}

func NewUserRepository(db *driverdb.DB, collection string) domain.UserRepository {
	return &userRepository{
		database:   db,
		collection: collection,
	}
}

func (ur *userRepository) Create(c context.Context, user *domain.User) error {
	// collection := ur.database.Collection(ur.collection)

	// _, err := collection.InsertOne(c, user)

	return nil
}

func (ur *userRepository) GetByID(c context.Context, id string) (domain.User, error) {
	// collection := ur.database.Collection(ur.collection)

	// var user domain.User

	// idHex, err := primitive.ObjectIDFromHex(id)
	// if err != nil {
	// 	return user, err
	// }

	// err = collection.FindOne(c, bson.M{"_id": idHex}).Decode(&user)
	return domain.User{}, nil
}

func (ur *userRepository) GetByEmail(c context.Context, email string) (domain.User, error) {
	// collection := ur.database.Collection(ur.collection)
	// var user domain.User
	// err := collection.FindOne(c, bson.M{"email": email}).Decode(&user)
	return domain.User{}, nil
}

func (ur *userRepository) GetByNickName(c context.Context, nickName string) (domain.User, error) {
	// collection := ur.database.Collection(ur.collection)
	// var user domain.User
	// err := collection.FindOne(c, bson.M{"nickName": nickName}).Decode(&user)
	return domain.User{}, nil
}
