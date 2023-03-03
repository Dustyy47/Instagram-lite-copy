package controller

type Author User

type UsersResponse struct {
	Users []User `json:"users"`
}

type User struct {
	UserID                int64  `json:"userID"`
	Nickname              string `json:"nickname"`
	Fullname              string `json:"fullname"`
	AvatarUrl             string `json:"avatarUrl"`
	IsActiveUserFollowing bool   `json:"isActiveUserFollowing,omitempty"`
}
