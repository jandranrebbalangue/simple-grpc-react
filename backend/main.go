package main

import (
	"log"
	"net/http"
	"time"

	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-contrib/cors"
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

type login struct {
	Username string `form:"username" json:"username" binding:"required"`
	Password string `form:"password" json:"password" binding:"required"`
}

var identityKey = "id"

func helloHandler(c *gin.Context) {
	claims := jwt.ExtractClaims(c)
	user, _ := c.Get(identityKey)
	log.Printf("claims:%#v\n", user)
	c.JSON(200, gin.H{
		"userID":    claims[identityKey],
		"userName":  user.(*User).UserName,
		"text":      "Hello World",
		"firstName": user.(*User).FirstName,
		"lastName":  user.(*User).LastName,
	})
}

type User struct {
	UserName  string
	FirstName string
	LastName  string
}

func main() {
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST"},
		AllowHeaders:     []string{"Content-Type", "Content-Length", "Accept-Encoding", "Authorization", "Cache-Control"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: false,
		MaxAge:           12 * time.Hour,
	}))
	r.GET("/todos", getTodos)
	r.POST("/todos", postTodos)
	r.GET("/todos/:id", getTodoByID)
	authMiddleware, err := jwt.New(&jwt.GinJWTMiddleware{
		Realm:       "test zone",
		Key:         []byte("secret key"),
		Timeout:     time.Hour,
		MaxRefresh:  time.Hour,
		IdentityKey: identityKey,
		SendCookie:  true,
		CookieName:  "jwt",
		PayloadFunc: func(data interface{}) jwt.MapClaims {
			if v, ok := data.(*User); ok {
				return jwt.MapClaims{
					identityKey: v.UserName,
				}
			}
			return jwt.MapClaims{}

		},
		IdentityHandler: func(c *gin.Context) interface{} {
			claims := jwt.ExtractClaims(c)
			return &User{
				UserName:  claims[identityKey].(string),
				FirstName: claims[identityKey].(string),
				LastName:  claims[identityKey].(string),
			}
		},
		Authenticator: func(c *gin.Context) (interface{}, error) {
			var loginVals login
			if err := c.ShouldBind(&loginVals); err != nil {
				return "", jwt.ErrMissingLoginValues
			}
			userId := loginVals.Username
			password := loginVals.Password
			if (userId == "admin" && password == "admin") || (userId == "test" && password == "test") {
				return &User{
					UserName:  userId,
					FirstName: "John",
					LastName:  "Doe",
				}, nil
			}
			return nil, jwt.ErrFailedAuthentication
		},
		Authorizator: func(data interface{}, c *gin.Context) bool {
			if v, ok := data.(*User); ok && v.UserName == "admin" {
				return true
			}
			return false
		},
		Unauthorized: func(c *gin.Context, code int, message string) {
			c.JSON(code, gin.H{
				"code":    code,
				"message": message,
			})
		},
		TokenLookup:   "header: Authorization,query:token,cookie:jwt",
		TokenHeadName: "Bearer",
		TimeFunc:      time.Now,
		RefreshResponse: func(c *gin.Context, code int, token string, expire time.Time) {
			c.JSON(code, gin.H{
				"code":   code,
				"expire": expire.Format(time.RFC3339),
				"token":  token,
			})
		},
		LoginResponse: func(c *gin.Context, code int, token string, expire time.Time) {
			c.JSON(code, gin.H{
				"code":    code,
				"message": token,
				"expire":  expire.Format(time.RFC3339),
			})
		},
	})
	if err != nil {
		log.Fatal("JWT Error:" + err.Error())
	}
	errInit := authMiddleware.MiddlewareInit()
	if errInit != nil {
		log.Fatal("authMiddleware.MiddlewareInit() Error:" + errInit.Error())
	}
	r.POST("/login", authMiddleware.LoginHandler)
	r.POST("/logout", authMiddleware.LogoutHandler)
	r.NoRoute(authMiddleware.MiddlewareFunc(), func(c *gin.Context) {
		claims := jwt.ExtractClaims(c)
		log.Printf("NoRoute claims:%#v\n", claims)
		c.JSON(404, gin.H{
			"code": "PAGE NOT FOUND", "message": "Page not found",
		})
	})
	auth := r.Group("/auth")
	auth.GET("/refresh_token", authMiddleware.RefreshHandler)
	auth.Use(authMiddleware.MiddlewareFunc())
	{
		auth.GET("hello", helloHandler)
	}
	// config := cors.DefaultConfig()
	// config.AllowOrigins = []string{"http://localhost:5173"}
	// r.Use(cors.New(config))
	// r.Use(cors.New(cors.Config{
	//   AllowOrigins:[]string{"*"},
	//   AllowMethods:[]string{"GET","POST"},
	//   AllowHeaders:[]string{"Origin"},
	//   ExposeHeaders:[]string{"Content-Length"}
	// }))
	r.Run(":8080")
}
