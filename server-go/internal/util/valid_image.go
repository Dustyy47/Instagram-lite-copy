package util

import (
	"errors"
	"mime/multipart"
	"strings"
)

func ValidateImage(file *multipart.FileHeader) error {
	// Check if file is an image
	contentType := file.Header.Get("Content-Type")
	if !strings.HasPrefix(contentType, "image/") {
		return errors.New("file is not an image")
	}

	// Check if file size is less than or equal to 8MB
	if file.Size > 8*1024*1024 {
		return errors.New("file size exceeds 8MB")
	}

	return nil
}
