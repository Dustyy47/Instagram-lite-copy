package controller

type ErrorResponse struct {
	Message string `json:"error"`
}

func errorResponse(message string) ErrorResponse {
	return ErrorResponse{Message: message}
}
