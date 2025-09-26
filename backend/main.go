package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

type RequestBody struct {
	JobDescription string `json:"jobDescription"`
	ResumeText     string `json:"resumeText"`
}

type ResponseBody struct {
	TailoredResume string `json:"tailoredResume"`
}

type OpenAIRequest struct {
	Model    string    `json:"model"`
	Messages []Message `json:"messages"`
}

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type OpenAIResponse struct {
	Choices []Choice `json:"choices"`
}

type Choice struct {
	Message Message `json:"message"`
}

func HandleRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		return events.APIGatewayProxyResponse{Body: "Error: OPENAI_API_KEY not set", StatusCode: 500}, nil
	}

	var requestBody RequestBody
	err := json.Unmarshal([]byte(request.Body), &requestBody)
	if err != nil {
		return events.APIGatewayProxyResponse{Body: "Error: Invalid request body", StatusCode: 400}, nil
	}

	prompt := fmt.Sprintf(`You are an expert HR manager and professional resume writer.
Your task is to tailor the following resume to perfectly match the given job description.
Focus on highlighting the most relevant skills and experiences. Rewrite parts of the resume to use keywords from the job description.
The output should be only the tailored resume text, without any introductory phrases like "Here is the tailored resume:".

**Job Description:**
---
%s
---

**Original Resume:**
---
%s
---

**Tailored Resume:**`, requestBody.JobDescription, requestBody.ResumeText)

	openAIReqBody := OpenAIRequest{
		Model: "gpt-3.5-turbo",
		Messages: []Message{
			{Role: "user", Content: prompt},
		},
	}

	reqBytes, err := json.Marshal(openAIReqBody)
	if err != nil {
		return events.APIGatewayProxyResponse{Body: "Error: Failed to create OpenAI request", StatusCode: 500}, nil
	}

	req, err := http.NewRequest("POST", "https://api.openai.com/v1/chat/completions", bytes.NewBuffer(reqBytes))
	if err != nil {
		return events.APIGatewayProxyResponse{Body: "Error: Failed to create HTTP request", StatusCode: 500}, nil
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return events.APIGatewayProxyResponse{Body: "Error: Failed to send request to OpenAI", StatusCode: 502}, nil
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)
	var openAIResp OpenAIResponse
	err = json.Unmarshal(respBody, &openAIResp)
	if err != nil || len(openAIResp.Choices) == 0 {
		// Если парсинг не удался, возвращаем сырой ответ для отладки
		return events.APIGatewayProxyResponse{Body: fmt.Sprintf("Error: Failed to parse OpenAI response. Raw: %s", string(respBody)), StatusCode: 502}, nil
	}

	finalResponse := ResponseBody{
		TailoredResume: openAIResp.Choices[0].Message.Content,
	}

	finalRespBytes, _ := json.Marshal(finalResponse)

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers:    map[string]string{"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
		Body:       string(finalRespBytes),
	}, nil
}

func main() {
	lambda.Start(HandleRequest)
}