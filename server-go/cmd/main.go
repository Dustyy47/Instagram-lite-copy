package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"

	server "github.com/Dustyy47/Instagram-lite-copy/server-go/pkg"
)

type httpHandler struct {
	message string
}

func (h httpHandler) ServeHTTP(resp http.ResponseWriter, req *http.Request) {
	fmt.Fprint(resp, h.message)
}

func main() {
	logrus.SetFormatter(new(logrus.JSONFormatter))

	if err := godotenv.Load(); err != nil {
		logrus.Fatalf("error loading env variables: %s", err.Error())
	}

	srv := new(server.Server)
	handler := httpHandler{
		message: "Runed",
	}

	go func() {
		if err := srv.Run(os.Getenv("PORT"), handler); err != nil {
			logrus.Fatalf("error occured while running http server: %s", err.Error())
		}
	}()

	logrus.Print("Server Runed")

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGTERM, syscall.SIGINT)
	<-quit

	logrus.Print("Server Shutting Down")

	if err := srv.Shutdown(context.Background()); err != nil {
		logrus.Errorf("error occured on server shutting down: %s", err.Error())
	}
}
