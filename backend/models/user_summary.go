package models

import "time"

type UserSummary struct {
	Id           int       `orm:"pk"`
	Name         string    `orm:"size(100)"`
	Mobile       string    `orm:"size(15);unique"`
	TotalExpense float64   `orm:"default(0)"`
	Owe          float64   `orm:"default(0)"`
	Owed         float64   `orm:"default(0)"`
	CreatedAt    time.Time `orm:"auto_now_add;type(datetime)"`
}
