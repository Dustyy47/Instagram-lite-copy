package domain

type GetProfileDataRequest struct {
}

type GetUserDataRequest struct {
}

type GetUserResponse struct {
	UserID    int64  `json:"userID"`
	NickName  string `json:"nickName"`
	FullName  string `json:"fullName"`
	AvatarURL string `json:"avatarUrl"`
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
