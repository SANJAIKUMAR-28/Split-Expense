package routes

import (
	"github.com/gorilla/mux"
	"splitexpense/handlers"
)

func SetupRoutes() *mux.Router {
	r := mux.NewRouter()
	r.HandleFunc("/signup", handlers.SignUpHandler).Methods("POST")
	r.HandleFunc("/signin", handlers.SignInHandler).Methods("POST")
	r.HandleFunc("/getDetails/{id}", handlers.GetDetails).Methods("GET")
	r.HandleFunc("/bills", handlers.AddExpense).Methods("POST")
	r.HandleFunc("/getTransaction/{id}", handlers.GetTransaction).Methods("GET")
	r.HandleFunc("/updateTransaction/{id}", handlers.UpdateTransaction).Methods("PUT")
	r.HandleFunc("/send-sms", handlers.SendSMS).Methods("POST")
	r.Use(mux.CORSMethodMiddleware(r))
	return r
}
