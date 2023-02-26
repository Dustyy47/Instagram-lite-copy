package controller

type SuccessResponse struct {
	Message string `json:"message"`
}

func successResponse(message string) SuccessResponse {
	return SuccessResponse{Message: message}
}
