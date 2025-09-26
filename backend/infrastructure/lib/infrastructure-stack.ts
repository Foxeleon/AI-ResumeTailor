import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // --- 1. Define the Lambda Function ---

    const goLambda = new lambda.Function(this, 'GoResumeTailorLambda', {
      runtime: lambda.Runtime.PROVIDED_AL2023,
      handler: 'bootstrap',
      architecture: lambda.Architecture.ARM_64,

      code: lambda.Code.fromAsset('..', { // Path is one level up

        bundling: {
          image: cdk.DockerImage.fromRegistry('public.ecr.aws/sam/build-go1.x:latest'),
          // The command is executed from the 'backend' directory, so it will find main.go
          command: [
            'bash', '-c',
            'GOOS=linux GOARCH=arm64 go build -o /asset-output/bootstrap main.go'
          ],
          user: "root"
        },
      }),

      environment: {
        'OPENAI_API_KEY': process.env.OPENAI_API_KEY ?? ''
      },

      timeout: cdk.Duration.seconds(30),
    });


    // --- 2. Define the API Gateway ---

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

    // --- 3. Output the API URL ---

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
    });
  }
}