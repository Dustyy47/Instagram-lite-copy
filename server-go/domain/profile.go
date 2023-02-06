package domain

type GetProfileDataRequest struct {
}

type GetUserDataRequest struct {
}

type GetProfileDataResponse struct {
	UserID   int64  `json:"userID"`
	Email    string `json:"email"`
	NickName string `json:"nickName"`
	FullName string `json:"fullName"`

	AvatarURL string `json:"avatarUrl"`

	Subscribes  []int64 `json:"subscribes"`
	Subscribers []int64 `json:"subscribers"`

	IsUserProfile bool `json:"isUserProfile"`
}

type GetUserDataResponse struct {
	UserID   int64  `json:"userID"`
	Email    string `json:"email"`
	NickName string `json:"nickName"`
	FullName string `json:"fullName"`

	AvatarURL string `json:"avatarUrl"`

	LikedPosts []int64 `json:"likedPosts"`
	Subscribes []int64 `json:"subscribes"`
}
