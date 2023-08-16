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
	ID        uint           `json:"id" gorm:"primaryKey"`
	Task      string         `json:"task"`
	Status    string         `json:"status"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `json:"deletedAt" gorm:"index"`
}

var todos = []Todo{}

func getTodos(c *gin.Context, db *gorm.DB) {
	db.Find(&todos)
	c.JSON(http.StatusOK, todos)
}

func postTodos(c *gin.Context, db *gorm.DB) {
	var newTodo Todo
	if err := c.BindJSON(&newTodo); err != nil {
		return
	}
	db.Create(&newTodo)
	c.IndentedJSON(http.StatusCreated, newTodo)
}

func getTaskByID(c *gin.Context) {
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
	c.IndentedJSON(http.StatusNotFound, gin.H{"message": "task not found"})
}

func deleteTaskById(c *gin.Context, db *gorm.DB) {
	id := c.Param("id")
	db.Delete(&Todo{}, id)
	c.IndentedJSON(http.StatusOK, gin.H{"message": "Delete successfully"})
}
func main() {
	r := gin.Default()
	envFile, err := godotenv.Read(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
		return
	}
	postgresUsername := envFile["POSTGRES_USERNAME"]
	postgresPassword := envFile["POSTGRES_PASSWORD"]
	postgresPort := envFile["POSTGRES_PORT"]
	postgresHostName := envFile["POSTGRES_HOST_NAME"]
	postgresDb := envFile["POSTGRES_DATABASE"]

	dsn := "host=" + postgresHostName + " user=" + postgresUsername + " password=" + postgresPassword + " dbname=" + postgresDb + " port=" + postgresPort + " sslmode=disable" + " TimeZone=Asia/Shanghai"
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
		AllowMethods:     []string{"GET", "POST", "DELETE"},
		AllowHeaders:     []string{"Content-Type", "Content-Length", "Accept-Encoding", "Authorization", "Cache-Control"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: false,
		MaxAge:           12 * time.Hour,
	}))
	r.GET("/tasks", func(ctx *gin.Context) {
		getTodos(ctx, db)
	})
	r.POST("/tasks", func(ctx *gin.Context) {
		postTodos(ctx, db)
	})
	r.DELETE("/tasks/:id", func(ctx *gin.Context) {
		deleteTaskById(ctx, db)
	})
	r.GET("/tasks/:id", getTaskByID)
	r.Run(":8080")
}
