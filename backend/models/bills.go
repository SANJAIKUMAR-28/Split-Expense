package models

import "time"

type Bill struct {
	Id              int       `orm:"auto;pk"`
	Amount          float64   `orm:"default(0)"`
	Description     string    `orm:"size(200)"`
	PayerId         int       `orm:"column(payer_id);default(0)"`
	PayerName       string    `orm:"column(payer_name);size(100)"`
	PayerMobile     string    `orm:"column(payer_mobile);size(100)"`
	RecipientId     int       `orm:"column(recipient_id);default(0)"`
	RecipientName   string    `orm:"column(recipient_name);size(100)"`
	RecipientMobile string    `orm:"column(recipient_mobile);size(100)"`
	IsSettled       bool      `orm:"column(is_settled);default(false)"`
	CreatedAt       time.Time `orm:"auto_now_add;type(datetime);column(created_at)"`
}
