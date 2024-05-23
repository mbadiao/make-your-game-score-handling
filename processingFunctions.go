package main

import (
	"encoding/json"
	"fmt"
	"os"
)

type donnees struct {
	Rank  int    `json:"rank"`
	Name  string `json:"name"`
	Score int    `json:"score"`
	Time  string `json:"time"`
}

func saveInDataBase(data []donnees) error {
	dataBase, err := os.Create("dataBase.json")

	if err != nil {
		return err
	}
	defer dataBase.Close()

	encodedData, err := json.Marshal(data)
	if err != nil {
		return err
	}
	_, err = dataBase.Write(encodedData)
	if err != nil {
		return err
	}
	return nil
}

func readFromDataBase() ([]donnees, error) {
	var tabForData []donnees
	data, err := os.ReadFile("dataBase.json")
	if err != nil {
		fmt.Println("ici")
		return tabForData, err
	}
	err = json.Unmarshal(data, &tabForData)
	if err != nil {
		fmt.Println("la bas")
		return tabForData, err
	}
	return tabForData, nil
}
