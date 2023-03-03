package controller

type LikeResponse struct {
	NumLikes          int64 `json:"numLikes"`
	IsActiveUserLiked bool  `json:"isActiveUserLiked"`
}
