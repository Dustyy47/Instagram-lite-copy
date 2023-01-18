package domain

import "go.mongodb.org/mongo-driver/bson/primitive"

type GetProfileDataRequest struct {
}

type GetUserDataRequest struct {
}

type GetProfileDataResponse struct {
	UserID   primitive.ObjectID `json:"userID"`
	Email    string             `json:"email"`
	NickName string             `json:"nickName"`
	FullName string             `json:"fullName"`

	AvatarURL string `json:"avatarUrl"`

	Subscribes  []primitive.ObjectID `json:"subscribes"`
	Subscribers []primitive.ObjectID `json:"subscribers"`

	IsUserProfile bool `json:"isUserProfile"`
}

type GetUserDataResponse struct {
	UserID   primitive.ObjectID `json:"userID"`
	Email    string             `json:"email"`
	NickName string             `json:"nickName"`
	FullName string             `json:"fullName"`

	AvatarURL string `json:"avatarUrl"`

	LikedPosts []primitive.ObjectID `json:"likedPosts"`
	Subscribes []primitive.ObjectID `json:"subscribes"`
}
