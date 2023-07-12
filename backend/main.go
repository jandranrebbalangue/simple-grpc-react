package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type todo struct {
	ID   string `json:"id"`
	Text string `json:"text"`
}

var todos = []todo{{ID: "1", Text: "Jujutsu Kaisen"}, {ID: "2", Text: "Engage Kiss"}}

func getTodos(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, todos)
}
func postTodos(c *gin.Context) {
	var newTodo todo
	if err := c.BindJSON(&newTodo); err != nil {
		return
	}
	todos = append(todos, newTodo)
	c.IndentedJSON(http.StatusCreated, newTodo)
}

func getTodoByID(c *gin.Context) {
	id := c.Param("id")
	for _, v := range todos {
		if v.ID == id {
			c.IndentedJSON(http.StatusOK, v)
			return
		}
	}
	c.IndentedJSON(http.StatusNotFound, gin.H{"message": "todo not found"})
}

func main() {
	r := gin.Default()
	r.GET("/todos", getTodos)
	r.POST("/todos", postTodos)
	r.GET("/todos/:id", getTodoByID)
	r.Run(":8080")
}
