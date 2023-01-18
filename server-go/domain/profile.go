package domain

import "go.mongodb.org/mongo-driver/bson/primitive"

type GetProfileDataRequest struct {
}

type GetProfileDataResponse struct {
	ID       primitive.ObjectID `json:"id"`
	Email    string             `json:"email"`
	NickName string             `json:"nickName"`
	FullName string             `json:"fullName"`

	AvatarURL string `json:"avatarUrl"`

	Subscribes  []primitive.ObjectID `json:"subscribes"`
	Subscribers []primitive.ObjectID `json:"subscribers"`

	IsUserProfile bool `json:"isUserProfile"`
}
