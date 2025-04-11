package handlers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"splitexpense/models"
	"strconv"
	"strings"
	_ "time"

	"github.com/joho/godotenv"

	"github.com/beego/beego/v2/client/orm"
	"github.com/gorilla/mux"
)

type CreateUserRequest struct {
	Name   string `json:"name"`
	Mobile string `json:"mobile"`
}

func SignUpHandler(w http.ResponseWriter, r *http.Request) {
	var req CreateUserRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	o := orm.NewOrm()

	// Insert into user table
	user := models.User{
		Name:   req.Name,
		Mobile: req.Mobile,
	}

	id, err := o.Insert(&user)
	if err != nil {
		http.Error(w, "User creation failed: "+err.Error(), http.StatusInternalServerError)
		return
	}

	userSummary := models.UserSummary{
		Id:     int(id),
		Name:   req.Name,
		Mobile: req.Mobile,
	}
	_, err = o.Insert(&userSummary)
	if err != nil {
		http.Error(w, "UserSummary creation failed: "+err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]any{
		"message": "User created successfully!",
		"user":    user,
	})
}

func SignInHandler(w http.ResponseWriter, r *http.Request) {
	var req CreateUserRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil || req.Mobile == "" {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	o := orm.NewOrm()
	user := models.User{}
	err = o.QueryTable("user").Filter("mobile", req.Mobile).One(&user)
	if err == orm.ErrNoRows {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, "Something went wrong", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]any{
		"message": "Sign-in successful",
		"user":    user,
	})
}

func GetDetails(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	IdStr, exists := vars["id"]

	if !exists {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(IdStr)
	if err != nil {
		http.Error(w, "Invalid User ID", http.StatusBadRequest)
		return
	}

	o := orm.NewOrm()
	var userSummary models.UserSummary

	err = o.QueryTable("user_summary").Filter("id", id).One(&userSummary)
	if err == orm.ErrNoRows {
		http.Error(w, "User summary not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, "Error fetching user summary: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Send summary response
	json.NewEncoder(w).Encode(map[string]any{
		"message":      "User summary fetched successfully",
		"TotalExpense": userSummary.TotalExpense,
		"Owe":          userSummary.Owe,
		"Owed":         userSummary.Owed,
	})
}

type CreateBill struct {
	Amount          float64 `json:"amount"`
	Description     string  `json:"description"`
	PayerMobile     string  `json:"payer_mobile"`
	RecipientMobile string  `json:"recipient_mobile"`
}

func AddExpense(w http.ResponseWriter, r *http.Request) {
	var req CreateBill
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	o := orm.NewOrm()
	payer, err := getUserByMobile(o, req.PayerMobile)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	recipient, err := getUserByMobile(o, req.RecipientMobile)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	bill := models.Bill{
		Amount:          req.Amount,
		Description:     req.Description,
		PayerId:         payer.Id,
		PayerName:       payer.Name,
		PayerMobile:     req.PayerMobile,
		RecipientId:     recipient.Id,
		RecipientName:   recipient.Name,
		RecipientMobile: req.RecipientMobile,
	}

	if _, err := o.Insert(&bill); err != nil {
		http.Error(w, "Bill creation failed: "+err.Error(), http.StatusInternalServerError)
		return
	}

	updateUserSummary(o, payer.Id, req.Amount/2, true)
	updateUserSummary(o, recipient.Id, req.Amount/2, false)

	json.NewEncoder(w).Encode(map[string]any{
		"message": "Bill created successfully!",
		"Bill":    bill,
	})
}

func getUserByMobile(o orm.Ormer, mobile string) (models.User, error) {
	var user models.User
	err := o.QueryTable("user").Filter("mobile", mobile).One(&user)
	if err == orm.ErrNoRows {
		return user, fmt.Errorf("user with mobile %s not found", mobile)
	}
	if err != nil {
		return user, fmt.Errorf("error fetching user: %v", err)
	}
	return user, nil
}

func updateUserSummary(o orm.Ormer, userID int, amount float64, isPayer bool) {
	summary := models.UserSummary{Id: userID}
	if err := o.Read(&summary); err == nil {
		if isPayer {
			summary.TotalExpense += amount
			summary.Owed += amount
		} else {
			summary.Owe += amount
		}
		o.Update(&summary)
	}
}

func GetTransaction(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	IdStr, exists := vars["id"]

	if !exists {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	userID, err := strconv.Atoi(IdStr)
	if err != nil {
		http.Error(w, "Invalid User ID", http.StatusBadRequest)
		return
	}

	o := orm.NewOrm()
	var bills []models.Bill

	cond := orm.NewCondition().
		Or("PayerId", userID).
		Or("RecipientId", userID)

	qs := o.QueryTable("bill")
	_, err = qs.SetCond(cond).All(&bills)
	if err != nil {
		http.Error(w, "Failed to fetch transactions", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(bills)
}

func UpdateTransaction(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	IdStr, exists := vars["id"]

	if !exists {
		http.Error(w, "Transaction ID is required", http.StatusBadRequest)
		return
	}

	txnID, err := strconv.Atoi(IdStr)
	if err != nil {
		http.Error(w, "Invalid User ID", http.StatusBadRequest)
		return
	}

	o := orm.NewOrm()
	txn := models.Bill{Id: txnID}

	if err = o.Read(&txn); err != nil {
		http.Error(w, fmt.Sprintf("Error reading transaction: %v", err), http.StatusInternalServerError)
		return
	}

	txn.IsSettled = true
	if _, err := o.Update(&txn, "IsSettled"); err != nil {
		http.Error(w, fmt.Sprintf("Error updating transaction: %v", err), http.StatusInternalServerError)
		return
	}

	payerSummary := models.UserSummary{Id: txn.PayerId}
	if err = o.Read(&payerSummary); err != nil {
		http.Error(w, fmt.Sprintf("Error reading payer summary: %v", err), http.StatusInternalServerError)
		return
	}
	payerSummary.Owed = payerSummary.Owed - txn.Amount/2
	if _, err := o.Update(&payerSummary, "Owed"); err != nil {
		http.Error(w, fmt.Sprintf("Error updating payer summary: %v", err), http.StatusInternalServerError)
		return
	}

	recipientSummary := models.UserSummary{Id: txn.RecipientId}
	if err = o.Read(&recipientSummary); err != nil {
		http.Error(w, fmt.Sprintf("Error reading recipient summary: %v", err), http.StatusInternalServerError)
		return
	}
	recipientSummary.Owe = recipientSummary.Owe - txn.Amount/2
	recipientSummary.TotalExpense = recipientSummary.TotalExpense + txn.Amount/2
	if _, err := o.Update(&recipientSummary, "Owe", "TotalExpense"); err != nil {
		http.Error(w, fmt.Sprintf("Error updating recipient summary: %v", err), http.StatusInternalServerError)
		return
	}

	response := map[string]string{"message": "Transaction settled successfully"}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)

}

type SMSRequest struct {
	To      string `json:"to"`
	Message string `json:"message"`
}

func SendSMS(w http.ResponseWriter, r *http.Request) {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	if r.Method != "POST" {
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
		return
	}

	var req SMSRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	accountSID := os.Getenv("ACCOUNT_SID")
	authToken := os.Getenv("AUTH_TOKEN")
	fromPhone := os.Getenv("FROM_PHONE")

	twilioURL := "https://api.twilio.com/2010-04-01/Accounts/" + accountSID + "/Messages.json"

	data := url.Values{}
	data.Set("To", req.To)
	data.Set("From", fromPhone)
	data.Set("Body", req.Message)

	client := &http.Client{}
	reqBody := ioutil.NopCloser(strings.NewReader(data.Encode()))

	twilioReq, _ := http.NewRequest("POST", twilioURL, reqBody)
	twilioReq.SetBasicAuth(accountSID, authToken)
	twilioReq.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	resp, err := client.Do(twilioReq)
	if err != nil {
		http.Error(w, "Failed to send SMS", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	bodyBytes, _ := ioutil.ReadAll(resp.Body)
	w.Write(bodyBytes) // You can customize the success response
}
