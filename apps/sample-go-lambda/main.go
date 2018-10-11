package main

import (
	"fmt"

	"github.com/aws/aws-lambda-go/lambda"
)

type Event struct {
	Username string
}

func handler(e Event) (string, error) {
	return fmt.Sprintf("<h1>Hello %s,</h1><h3>from the AWS Lambda GO</h3>", e.Username), nil
}

func main() {
	lambda.Start(handler)
}
