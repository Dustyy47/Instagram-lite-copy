package util

import (
	"errors"
	"mime/multipart"
	"os"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

func SaveUploadedFile(c *gin.Context, file *multipart.FileHeader, pathFolder string) (string, error) {
	var millisecondsUTC string = strconv.FormatInt(time.Now().UTC().UnixNano()/1e6, 10)
	fileName := millisecondsUTC + "--" + file.Filename

	err := c.SaveUploadedFile(file, pathFolder+fileName)
	if err != nil {
		logrus.Errorf("error saving file: %w", err)
		return "", errors.New("error saving file")
	}

	return fileName, nil
}

func RemoveFileFromServer(filePath string) error {
	err := os.Remove(filePath)
	return err
}
