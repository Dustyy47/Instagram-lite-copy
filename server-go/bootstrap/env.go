package bootstrap

import (
	"github.com/sirupsen/logrus"
	"github.com/spf13/viper"
)

type Env struct {
	AppEnv string `mapstructure:"APP_ENV"`

	DBDriver string `mapstructure:"DB_DRIVER"`
	DBSource string `mapstructure:"DB_SOURCE"`

	MigrationURL string `mapstructure:"MIGRATION_URL"`

	ServerAddress         string `mapstructure:"SERVER_ADDRESS"`
	ContextTimeout        int    `mapstructure:"CONTEXT_TIMEOUT"`
	AccessTokenExpiryHour int    `mapstructure:"ACCESS_TOKEN_EXPIRY_HOUR"`
	AccessTokenSecret     string `mapstructure:"ACCESS_TOKEN_SECRET"`

	DefaultLimitFindUsers         int32 `mapstructure:"DEFAULT_LIMIT_FIND_USERS"`
	DefaultLimitGetPostsByUser    int32 `mapstructure:"DEFAULT_LIMIT_GET_POSTS_BY_USER"`
	DefaultLimitGetCommentsOfPost int32 `mapstructure:"DEFAULT_LIMIT_GET_COMMENT_OF_POST"`
}

func NewEnv() *Env {
	env := Env{}
	viper.SetConfigFile(".env")

	err := viper.ReadInConfig()
	if err != nil {
		logrus.Fatal("Can't find the file .env: %v", err)
	}

	err = viper.Unmarshal(&env)
	if err != nil {
		logrus.Fatal("Environment can't be loaded: %v", err)
	}

	if env.AppEnv == "development" {
		logrus.Println("The App is running in development env")
	}

	return &env
}
