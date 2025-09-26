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

// --- DATA STRUCTURES (API Contract) ---

// RequestBody defines the structure of the JSON we expect from the frontend.
// The `json:"..."` tags tell Go how to map the JSON fields to the struct fields.
type RequestBody struct {
	JobDescription string `json:"jobDescription"`
	ResumeText     string `json:"resumeText"`
}

// ResponseBody defines the structure of the JSON we send back.
type ResponseBody struct {
	TailoredResume string `json:"tailoredResume"`
}

// --- DATA STRUCTURES for OpenAI API ---

// OpenAIRequest defines the body of the request to the OpenAI API.
type OpenAIRequest struct {
	Model    string    `json:"model"`
	Messages []Message `json:"messages"`
}

// Message represents a single message in the conversation with the AI.
type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// OpenAIResponse defines the structure of the response from the OpenAI API.
// We are only interested in the Choices field.
type OpenAIResponse struct {
	Choices []Choice `json:"choices"`
}

// Choice contains the actual response message from the AI.
type Choice struct {
	Message Message `json:"message"`
}

// --- MAIN LAMBDA HANDLER LOGIC ---

// HandleRequest is the main function that AWS Lambda will invoke.
// It takes a request from API Gateway and returns a response.
func HandleRequest(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// 1. Get the OpenAI API key from the Lambda's environment variables.
	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		return events.APIGatewayProxyResponse{Body: "Error: OPENAI_API_KEY environment variable not set", StatusCode: 500}, nil
	}

	// 2. Parse the incoming request body from the frontend.
	var requestBody RequestBody
	err := json.Unmarshal([]byte(request.Body), &requestBody)
	if err != nil {
		return events.APIGatewayProxyResponse{Body: "Error: Invalid request body", StatusCode: 400}, nil
	}

	// 3. Construct the prompt for the OpenAI API.
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

	// 4. Create the request body for the OpenAI API call.
	openAIReqBody := OpenAIRequest{
		Model: "gpt-4о", // Using a fast and cost-effective model.
		Messages: []Message{
			{Role: "user", Content: prompt},
		},
	}
	
	reqBytes, err := json.Marshal(openAIReqBody)
	if err != nil {
		return events.APIGatewayProxyResponse{Body: "Error: Failed to create OpenAI request body", StatusCode: 500}, nil
	}

	// 5. Execute the HTTP request to the OpenAI API.
	req, err := http.NewRequest("POST", "https://api.openai.com/v1/chat/completions", bytes.NewBuffer(reqBytes))
	if err != nil {
		return events.APIGatewayProxyResponse{Body: "Error: Failed to create HTTP request object", StatusCode: 500}, nil
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return events.APIGatewayProxyResponse{Body: "Error: Failed to send request to OpenAI API", StatusCode: 502}, nil
	}
	defer resp.Body.Close()

	// 6. Parse the response from the OpenAI API.
	respBody, _ := io.ReadAll(resp.Body)
	var openAIResp OpenAIResponse
	err = json.Unmarshal(respBody, &openAIResp)
	if err != nil || len(openAIResp.Choices) == 0 {
		return events.APIGatewayProxyResponse{Body: fmt.Sprintf("Error: Failed to parse OpenAI response. Raw: %s", string(respBody)), StatusCode: 502}, nil
	}

	// 7. Construct the successful response for the frontend.
	finalResponse := ResponseBody{
		TailoredResume: openAIResp.Choices[0].Message.Content,
	}

	finalRespBytes, _ := json.Marshal(finalResponse)

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers:    map[string]string{
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
		},
		Body:       string(finalRespBytes),
	}, nil
}

func main() {
	lambda.Start(HandleRequest)
}