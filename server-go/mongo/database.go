package mongo

import (
	"context"
	"time"

	"github.com/sirupsen/logrus"
)

func NewMongoDatabase(mongodbURI string) Client {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := NewClient(mongodbURI)
	if err != nil {
		logrus.Fatal(err)
	}

	err = client.Connect(ctx)
	if err != nil {
		logrus.Fatal(err)
	}

	err = client.Ping(ctx)
	if err != nil {
		logrus.Fatal(err)
	}

	return client
}

func CloseMongoDBConnection(client Client) {
	if client == nil {
		return
	}

	err := client.Disconnect(context.TODO())
	if err != nil {
		logrus.Fatal(err)
	}

	logrus.Println("Connection to MongoDB closed.")
}
