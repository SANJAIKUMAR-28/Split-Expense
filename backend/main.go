package main

import (
	"fmt"
	"log"
	"net/http"
	"splitexpense/middleware"
	"splitexpense/models"
	routes "splitexpense/routes"
)

func main() {
	models.Init()

	r := routes.SetupRoutes()
	handlerWithCORS := middleware.CORSMiddleware(r)
	fmt.Println("Server is running at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", handlerWithCORS))

}
