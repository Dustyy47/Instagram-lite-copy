package bootstrap

import (
	"github.com/sirupsen/logrus"
	"github.com/spf13/viper"
)

type Env struct {
	AppEnv                 string `mapstructure:"APP_ENV"`
	ServerAddress          string `mapstructure:"SERVER_ADDRESS"`
	ContextTimeout         int    `mapstructure:"CONTEXT_TIMEOUT"`
	DB_URL                 string `mapstructure:"DB_URL"`
	DBName                 string `mapstructure:"DB_NAME"`
	AccessTokenExpiryHour  int    `mapstructure:"ACCESS_TOKEN_EXPIRY_HOUR"`
	RefreshTokenExpiryHour int    `mapstructure:"REFRESH_TOKEN_EXPIRY_HOUR"`
	AccessTokenSecret      string `mapstructure:"ACCESS_TOKEN_SECRET"`
	RefreshTokenSecret     string `mapstructure:"REFRESH_TOKEN_SECRET"`
}

func NewEnv() *Env {
	env := Env{}
	viper.SetConfigFile(".env")

	err := viper.ReadInConfig()
	if err != nil {
		logrus.Fatal("Can't find the file .env : ", err)
	}

	err = viper.Unmarshal(&env)
	if err != nil {
		logrus.Fatal("Environment can't be loaded: ", err)
	}

	if env.AppEnv == "development" {
		logrus.Println("The App is running in development env")
	}

	return &env
}
