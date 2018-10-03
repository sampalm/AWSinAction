package main

import (
	"net/http"
)

func main() {
	const indexPage = "public/index.html"
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, indexPage)
	})
	http.HandleFunc("/uilia", Index)
	http.ListenAndServe(":5000", nil)
}

func Index(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello garotinho"))
}
