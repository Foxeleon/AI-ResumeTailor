// infrastructure/lib/infrastructure-stack.ts

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // --- 1. Define the Lambda Function ---

    const goLambda = new lambda.Function(this, 'GoResumeTailorLambda', {
      // CORRECTED RUNTIME: Using the modern, recommended runtime for Go.
      runtime: lambda.Runtime.PROVIDED_AL2023,

      // The handler name for 'provided' runtimes is always 'bootstrap'.
      // This is the name CDK will give to our compiled binary.
      handler: 'bootstrap',

      architecture: lambda.Architecture.ARM_64, // Using ARM for better performance and cost.

      code: lambda.Code.fromAsset(path.join(__dirname, '../../backend'), {
        bundling: {
          // We must use an image that matches our runtime's architecture.
          image: cdk.DockerImage.fromRegistry('public.ecr.aws/sam/build-go1.x:latest'),

          // The command now needs to specify the architecture.
          command: [
            'bash', '-c',
            'GOOS=linux GOARCH=arm64 go build -o /asset-output/bootstrap main.go'
          ],
          user: "root"
        },
      }),

      environment: {
        'OPENAI_API_KEY': 'YOUR_OPENAI_API_KEY' // CRITICAL: Replace with your actual secret key.
      },

      timeout: cdk.Duration.seconds(30),
    });


    // --- 2. Define the API Gateway (No changes here) ---

    const api = new apigateway.RestApi(this, 'ResumeTailorApi', {
      restApiName: 'AI Resume Tailor Service',
      description: 'This service tailors resumes using AI.',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: ['POST', 'OPTIONS'],
        allowHeaders: ['Content-Type'],
      }
    });

    const tailorResource = api.root.addResource('tailor');
    tailorResource.addMethod('POST', new apigateway.LambdaIntegration(goLambda));

    // --- 3. Output the API URL (No changes here) ---

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
    });
  }
}