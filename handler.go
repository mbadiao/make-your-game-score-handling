package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"net/http"
)

func indexHandler(w http.ResponseWriter, r *http.Request) {
	tmp, err := template.ParseFiles("index.html")
	if err != nil {
		fmt.Println("y'a erreur")
		return
	}
	tmp.Execute(w, nil)
}

func getDataHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		fmt.Println("getdatahandeler")
		arrayofdata, err := readFromDataBase()
		if err != nil {
			fmt.Println("error01")
			return
		}
		jsondata, err := json.Marshal(arrayofdata)
		if err != nil {
			fmt.Println("error02")
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(jsondata)

		fmt.Println(string(jsondata))

	} else {
		fmt.Println("page d'erreur ok")
		return
	}
}

func postDataHandler(w http.ResponseWriter, r *http.Request) {

	if r.Method == "POST" {
		fmt.Println("postdatahandeler")
		var mydonnee donnees
		err := json.NewDecoder(r.Body).Decode(&mydonnee)
		if err != nil {
			fmt.Println("error1")
			return
		}
		arrayofdonnees, err := readFromDataBase()
		if err != nil {
			fmt.Println("error2")
			return
		}

		arrayofdonnees = append(arrayofdonnees, mydonnee)

		fmt.Println(arrayofdonnees)

		err = saveInDataBase(arrayofdonnees)
		if err != nil {
			fmt.Println("error3")
			return
		}
	} else {
		fmt.Println("page d'erreur")
		return
	}

}
