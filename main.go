package main

import (
	"fmt"
	"net/http"
)

func main() {
	// Configuration des répertoires statiques
	// Configuration des répertoires statiques
	staticDir := "assets"
	staticDir2 := "Web"
	staticDir3 := "Script"

	// Création des gestionnaires de fichiers statiques
	fileServer := http.FileServer(http.Dir(staticDir))
	fileServer2 := http.FileServer(http.Dir(staticDir2))
	fileServer3 := http.FileServer(http.Dir(staticDir3))

	// Définition des routes
	mux := http.NewServeMux()
	mux.Handle("/assets/", http.StripPrefix("/assets/", fileServer))
	mux.Handle("/Web/", http.StripPrefix("/Web/", fileServer2))
	mux.Handle("/Script/", http.StripPrefix("/Script/", fileServer3))
	mux.HandleFunc("/", indexHandler)
	mux.HandleFunc("/postdata",postDataHandler)
	mux.HandleFunc("/getdata",getDataHandler)

	// Démarrage du serveur HTTP
	addr := ":8080"
	fmt.Println("listening at http://localhost:8080")
	if err := http.ListenAndServe(addr, mux); err != nil {
		fmt.Printf("Erreur de démarrage du serveur: %s\n", err)
	}
}
