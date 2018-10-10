package main

import (
	"fmt"

	"github.com/aws/aws-lambda-go/lambda"
)

type Event struct {
	Username string
}

func handler(e Event) (string, error) {
	return fmt.Sprintf("Hello %s from the AWS Lambda GO", e.Username), nil
}

func main() {
	lambda.Start(handler)
}
