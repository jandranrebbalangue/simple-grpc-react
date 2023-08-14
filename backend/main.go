package main

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Todo struct {
	ID        uint   `gorm:"primaryKey"`
	Task      string `json:"task"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

var todos = []Todo{{ID: 1, Task: "Code simple task"}, {ID: 2, Task: "Learn Go"}}

func getTodos(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, todos)
}

func postTodos(c *gin.Context, db *gorm.DB) {
	var newTodo Todo
	if err := c.BindJSON(&newTodo); err != nil {
		return
	}
	db.Create(&newTodo)
	c.IndentedJSON(http.StatusCreated, newTodo)
}

func getTodoByID(c *gin.Context) {
	paramId := c.Param("id")
	id, err := strconv.ParseUint(paramId, 10, 32)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	for _, v := range todos {
		if v.ID == uint(id) {
			c.IndentedJSON(http.StatusOK, v)
			return
		}
	}
	c.IndentedJSON(http.StatusNotFound, gin.H{"message": "todo not found"})
}

func main() {
	r := gin.Default()
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
		return
	}

	dsn := "host=localhost user=admin password=admin dbname=admin port=5432 sslmode=disable TimeZone=Asia/Shanghai"
	db, err := gorm.Open(postgres.New(postgres.Config{
		DSN:                  dsn,
		PreferSimpleProtocol: true,
	}), &gorm.Config{})
	if err != nil {
		log.Fatal(err.Error())
		return
	}
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST"},
		AllowHeaders:     []string{"Content-Type", "Content-Length", "Accept-Encoding", "Authorization", "Cache-Control"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: false,
		MaxAge:           12 * time.Hour,
	}))
	r.GET("/todos", getTodos)
	r.POST("/add/todo", func(ctx *gin.Context) {
		postTodos(ctx, db)
	})
	r.GET("/todos/:id", getTodoByID)
	r.Run(":8080")
}
