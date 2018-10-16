/**
AWS LAMBDA COMMAND:
aws lambda invoke --function-name questionresponse --payload file://payload.txt outfile
*/
package main

import (
	"fmt"

	"github.com/aws/aws-lambda-go/lambda"
)

type Event struct {
	Question string
}

type Response struct {
	Question string
	Answer   string
}

func handler(e Event) (Response, error) {
	/*if len(e.Username) == 0 {
		return "", fmt.Errorf("No Name given.")
	}

	if e.Username[0] == 'S' || e.Username[0] == 'U' {
		return "", fmt.Errorf("We don't like %s.", e.Username)
	}*/

	return Response{
		Question: e.Question,
		Answer:   fmt.Sprintf("I dont know. %s", e.Question),
	}, nil
}

func main() {
	lambda.Start(handler)
}
