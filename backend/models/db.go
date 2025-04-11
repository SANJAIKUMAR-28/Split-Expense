package models

import (
	"fmt"
	"log"
	"os"

	"github.com/beego/beego/v2/client/orm"
	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

func Init() {
	orm.RegisterDriver("mysql", orm.DRMySQL)
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASS")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		dbUser, dbPass, dbHost, dbPort, dbName)
	err = orm.RegisterDataBase("default", "mysql", dsn)
	if err != nil {
		panic("DB Register Error: " + err.Error())
	}

	orm.RegisterModel(
		new(User),
		new(UserSummary),
		new(Bill),
	)

	err = orm.RunSyncdb("default", false, true)
	if err != nil {
		panic("Sync DB failed: " + err.Error())
	}

	fmt.Println("Database synced successfully!")
}
