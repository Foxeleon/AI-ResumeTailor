# AI Resume Tailor

**AI Resume Tailor** is a web application designed to intelligently adapt your resume to specific job requirements. Leveraging the power of modern language models, it analyzes a job description and your resume, then rewrites it to highlight the most relevant skills and experiences.

## Key Features

-   **Intelligent Adaptation:** Analyzes job descriptions to identify keywords and required competencies.
-   **Automated Rewriting:** Reformulates key sections of your resume to align perfectly with the employer's request.
-   **Simple Interface:** A clean and intuitive UI for quickly inputting data and receiving results.
-   **Modern Tech Stack:** Built with a cutting-edge cloud and web technology stack to ensure high performance and scalability.

## Architecture and Technologies

The project utilizes a modern serverless architecture, ensuring high availability, automatic scaling, and cost optimization.

### Frontend

-   **Framework:** [React](https://react.dev/)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Hosting:** [AWS Amplify](https://aws.amazon.com/amplify/)

The frontend is a Single-Page Application (SPA) deployed using AWS Amplify, which provides global content delivery (CDN) and automated CI/CD.

### Backend

-   **Architecture:** Serverless
-   **Language:** [Go (Golang)](https://go.dev/)
-   **Runtime:** [AWS Lambda](https://aws.amazon.com/lambda/)
-   **API:** [AWS API Gateway](https://aws.amazon.com/api-gateway/)
-   **AI Model:** Integration with [OpenAI API](https://platform.openai.com/docs/overview)

The backend logic is implemented as a Go function running on AWS Lambda. This enables "on-demand" code execution without server management. API Gateway provides a secure and scalable entry point (endpoint) for the frontend.

### Infrastructure as Code (IaC)

-   **Tool:** [AWS Cloud Development Kit (CDK)](https://aws.amazon.com/cdk/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)

The entire cloud infrastructure (Lambda, API Gateway, IAM Roles, and permissions) is defined as code using the AWS CDK. This allows for versioning, reproducibility, and reliable management of the architecture.

## Getting Started

### Prerequisites

-   Node.js
-   Go
-   AWS CLI (configured with your credentials)
-   Docker Desktop (must be running)
-   AWS CDK Toolkit (`npm install -g aws-cdk`)

### Installation and Setup

1.  **Clone the repository:**
    ```sh
    git clone <YOUR_REPOSITORY_URL>
    cd <project-folder-name>
    ```

2.  **Configure the Backend:**
    -   Navigate to the `backend/infrastructure` directory.
    -   Install dependencies: `npm install`.
    -   Create a `.env` file and add your OpenAI key: `OPENAI_API_KEY=sk-xxxx...`.
    -   Deploy the infrastructure:
        ```sh
        cdk bootstrap
        cdk deploy
        ```
    -   Copy the `ApiUrl` from the command output.

3.  **Configure and Run the Frontend:**
    -   Navigate to the root project directory.
    -   In `src/App.tsx`, paste the copied `ApiUrl` into the `API_ENDPOINT` constant. Remember to append `/tailor`.
    -   Install dependencies: `npm install`.
    -   Start the development server: `npm run dev`.

4.  Open `http://localhost:5173` in your browser.