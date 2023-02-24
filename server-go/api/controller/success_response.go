package controller

type SuccessResponse struct {
	Message string `json:"error"`
}

func successResponse(message string) SuccessResponse {
	return SuccessResponse{Message: message}
}
