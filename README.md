# Job Application Tracker - AI-Powered Serverless Platform

A modern, serverless job application tracker with AI-powered features built on AWS. Track applications, get intelligent priority recommendations, auto-fill job details from URLs, and prepare for interviews with AI assistance.

## Features

### Current (Phase 1)
- **Full CRUD Operations**: Add, edit, delete, and view job applications
- **Real-time Status Tracking**: Visual status indicators (Applied, Interview, Offer, Rejected)
- **Interview Round Tracking**: Track multiple interview rounds (x1-x10)
- **Analytics Dashboard**: View application statistics and trends
- **Secure Authentication**: Cognito-based user management
- **Responsive UI**: Clean, enterprise-grade table interface

### Roadmap (Phase 2-6)
- **AI Job Scraping**: Paste job URL and auto-fill all details
- **Smart Priority Engine**: AI analyzes which applications need attention
- **Job Recommendations**: AI monitors job boards and suggests matches
- **Interview Simulator**: Real-time AI mock interviews with voice
- **Resume Optimizer**: AI-tailored resumes per application
- **Cover Letter Generator**: Personalized cover letters

## Tech Stack

### Backend
- AWS Lambda (Node.js 18)
- DynamoDB (NoSQL database)
- API Gateway (REST API)
- Cognito (Authentication)
- Bedrock (AI - Claude 3)

### Frontend
- React 18
- AWS Amplify
- S3 (Static hosting)
- CloudFront (CDN)

### Infrastructure
- Terraform (IaC)
- Bash scripts (Deployment automation)

## Getting Started

### Prerequisites
```bash
# Required
- AWS CLI configured
- Terraform >= 1.0
- Node.js >= 18
- Git Bash (Windows) or Bash (Linux/Mac)
```

### Installation

1. **Clone Repository**
```bash
git clone https://github.com/AbigailAsibreAmoah/Job-Tracker.git
cd TRACKER
```

2. **Deploy Infrastructure**
```bash
./scripts/deploy.sh
```

3. **Deploy Frontend**
```bash
./scripts/frontend.sh
```

4. **Access Application**
Visit the CloudFront URL from terraform output.

## Project Structure

```
TRACKER/
├── backend/
│   ├── *.tf                      # Terraform infrastructure
│   ├── job_applications.zip      # Lambda package (generated)
│   └── analytics.zip             # Lambda package (generated)
├── frontend/
│   ├── *.tf                      # Frontend infrastructure
│   └── react-app/                # React application
│       ├── src/
│       │   ├── components/       # React components
│       │   ├── App.js           # Main app
│       │   └── App.css          # Styles
│       └── public/
├── lambda-functions/
│   ├── job-applications.js       # CRUD Lambda
│   ├── analytics.js              # Analytics Lambda
│   └── package.json
├── scripts/
│   ├── deploy.sh                 # Deploy infrastructure
│   ├── frontend.sh               # Deploy frontend
│   ├── test.sh                   # Test deployment
│   └── destroy.sh                # Cleanup resources
├── main.tf                       # Root Terraform
├── variables.tf
├── outputs.tf
└── README.md
```

## Available Scripts

### Deploy Infrastructure
```bash
./scripts/deploy.sh
```
Packages Lambda functions, deploys backend and frontend infrastructure.

### Deploy Frontend Only
```bash
./scripts/frontend.sh
```
Builds React app and deploys to S3/CloudFront.

### Test Deployment
```bash
./scripts/test.sh
```
Tests API endpoints and authentication.

### Destroy Infrastructure
```bash
./scripts/destroy.sh
```
Removes all AWS resources.

## Cost Estimate

| Service | Monthly Cost (100 applications) |
|---------|--------------------------------|
| Lambda | $5-10 |
| DynamoDB | $2-5 |
| S3 + CloudFront | $1-3 |
| API Gateway | $3-5 |
| Cognito | Free tier |
| **Total** | **$11-23/month** |

## Security Features

- **Cognito Authentication**: Secure user management with email verification
- **IAM Roles**: Least privilege access for all resources
- **HTTPS Only**: All traffic encrypted via CloudFront
- **CORS**: Properly configured for frontend-backend communication
- **API Authorization**: Cognito-based API Gateway authorization

## Development Roadmap

### Phase 2: AI Job Scraping
- URL parser Lambda with Bedrock
- Auto-fill job details from URLs
- Support for LinkedIn, Indeed, Glassdoor

### Phase 3: Smart Priority Engine
- AI-powered priority scoring
- Daily digest emails
- Action recommendations

### Phase 4: Job Board Monitor
- Automated job discovery
- AI-powered job matching
- Email/SMS notifications

### Phase 5: Interview Prep
- Real-time AI mock interviews
- Voice interaction (Transcribe + Polly)
- Company-specific prep

### Phase 6: Advanced Features
- Resume optimizer
- Cover letter generator
- Email draft generator

## Troubleshooting

### CORS Errors
Ensure CloudFront domain is in API Gateway CORS configuration.

### Lambda Errors
Check CloudWatch logs:
```bash
aws logs tail /aws/lambda/job-tracker-applications-api-dev --follow
```

### Deployment Fails
```bash
terraform destroy -auto-approve
./scripts/deploy.sh
```

## License

MIT License - feel free to use for personal or commercial projects.

## Contributing

Contributions welcome! Please open an issue or PR.

## Contact

For questions or support, please open an issue on GitHub.
