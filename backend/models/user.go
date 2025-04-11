package models

import "time"

type User struct {
	Id        int       `orm:"auto;pk"`
	Name      string    `orm:"size(100)"`
	Mobile    string    `orm:"size(15);unique"`
	CreatedAt time.Time `orm:"auto_now_add;type(datetime)"`
}
