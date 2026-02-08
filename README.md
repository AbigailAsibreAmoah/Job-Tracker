# Job Application Tracker - Powered by Isla AI

A modern, serverless job application tracker with Isla, your AI-powered job search assistant. Track applications, get intelligent priority recommendations, auto-fill job details from URLs, chat with AI for career advice, and prepare for interviews with AI assistance.

## Meet Isla

**Isla** (Intelligent Search & Labor Assistant) is your autonomous AI job search companion that:
- **Chat Interface**: Ask questions and get instant AI-powered career advice
- **Web Search**: Searches the internet for latest job market trends and advice
- **Context-Aware**: Knows about your applications and provides personalized guidance
- **Daily Analysis**: Analyzes your applications and prioritizes what needs attention
- **Auto-Fill**: Extracts job details from URLs using AI
- **Smart Insights**: Suggests actions based on application timelines and deadlines

## Features

### Current (Phase 1-3)
- **Full CRUD Operations**: Add, edit, delete, and view job applications
- **Real-time Status Tracking**: Visual status indicators (Applied, Interview, Offer, Rejected)
- **Interview Round Tracking**: Track multiple interview rounds (x1-x10)
- **Analytics Dashboard**: View application statistics and trends
- **Secure Authentication**: Cognito-based user management
- **Responsive UI**: Clean, enterprise-grade table interface
- **Isla AI Chat**: Floating chat bubble with AI assistant (Claude 3 + Tavily web search)
- **Priority Engine**: AI-powered priority scoring with daily analysis
- **URL Parser**: Auto-fill job details from job posting URLs

### Roadmap (Phase 4-6)
- **Job Board Monitor**: AI monitors job boards and suggests matches
- **Interview Simulator**: Real-time AI mock interviews with voice
- **Resume Optimizer**: AI-tailored resumes per application
- **Cover Letter Generator**: Personalized cover letters
- **Email Draft Generator**: AI-generated follow-up emails

## Tech Stack

### Backend
- AWS Lambda (Node.js 18) - 5 functions
- DynamoDB (NoSQL database)
- API Gateway (REST API)
- Cognito (Authentication)
- Bedrock (AI - Claude 3 Sonnet)
- Tavily (Web search API)
- EventBridge (Daily scheduler)

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
- Tavily API key (free tier: https://tavily.com)
```

### Installation

1. **Clone Repository**
```bash
git clone https://github.com/AbigailAsibreAmoah/Job-Tracker.git
cd TRACKER
```

2. **Configure Tavily API Key**
```bash
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars and add your Tavily API key
```

3. **Deploy Infrastructure**
```bash
./scripts/deploy.sh
```

4. **Deploy Frontend**
```bash
./scripts/frontend.sh
```

5. **Access Application**
Visit the CloudFront URL from terraform output.

## Project Structure

```
TRACKER/
├── backend/
│   ├── *.tf                      # Terraform infrastructure
│   ├── job_applications.zip      # Lambda package (generated)
│   ├── analytics.zip             # Lambda package (generated)
│   ├── url_parser.zip            # Lambda package (generated)
│   ├── priority_engine.zip       # Lambda package (generated)
│   └── isla_chat.zip             # Lambda package (generated)
├── frontend/
│   ├── *.tf                      # Frontend infrastructure
│   └── react-app/                # React application
│       ├── src/
│       │   ├── components/       # React components
│       │   │   ├── IslaChat.js  # AI chat interface
│       │   │   └── ...
│       │   ├── App.js           # Main app
│       │   └── App.css          # Styles
│       └── public/
├── lambda-functions/
│   ├── job-applications.js       # CRUD Lambda
│   ├── analytics.js              # Analytics Lambda
│   ├── url-parser.js             # URL parsing Lambda
│   ├── priority-engine.js        # Priority scoring Lambda
│   ├── isla-chat.js              # AI chat Lambda
│   └── package.json
├── scripts/
│   ├── deploy.sh                 # Deploy infrastructure (with caching)
│   ├── frontend.sh               # Deploy frontend (with caching)
│   ├── test.sh                   # Test deployment
│   └── destroy.sh                # Cleanup resources
├── main.tf                       # Root Terraform
├── variables.tf
├── terraform.tfvars.example      # API key template
├── outputs.tf
└── README.md
```

## Available Scripts

### Deploy Infrastructure
```bash
./scripts/deploy.sh
```
Packages Lambda functions (with smart caching), deploys backend and frontend infrastructure.

### Deploy Frontend Only
```bash
./scripts/frontend.sh
```
Builds React app (with smart caching) and deploys to S3/CloudFront.

### Test Deployment
```bash
./scripts/test.sh
```
Tests Isla chat Lambda and infrastructure.

### Destroy Infrastructure
```bash
./scripts/destroy.sh
```
Removes all AWS resources.

## Cost Estimate

| Service | Monthly Cost (100 applications) |
|---------|--------------------------------|
| Lambda (5 functions) | $5-10 |
| DynamoDB | $2-5 |
| S3 + CloudFront | $1-3 |
| API Gateway | $3-5 |
| Bedrock (Claude 3) | $3-8 |
| Tavily (Web search) | Free tier |
| Cognito | Free tier |
| **Total** | **$14-31/month** |

## Security Features

- **Cognito Authentication**: Secure user management with email verification
- **IAM Roles**: Least privilege access for all resources
- **HTTPS Only**: All traffic encrypted via CloudFront
- **CORS**: Properly configured for frontend-backend communication
- **API Authorization**: Cognito-based API Gateway authorization

## Development Roadmap

### ✅ Phase 1: Core Features (Complete)
- CRUD operations for job applications
- Authentication and user management
- Analytics dashboard
- Enterprise-grade UI

### ✅ Phase 2: AI Job Scraping (Complete)
- URL parser Lambda with Bedrock
- Auto-fill job details from URLs
- Support for LinkedIn, Indeed, Glassdoor

### ✅ Phase 3: Smart Priority Engine (Complete)
- AI-powered priority scoring
- Daily automated analysis (9 AM UTC)
- Action recommendations
- Isla AI chat interface with web search

### Phase 4: Job Board Monitor (Planned)
- Automated job discovery
- AI-powered job matching
- Email/SMS notifications

### Phase 5: Interview Prep (Planned)
- Real-time AI mock interviews
- Voice interaction (Transcribe + Polly)
- Company-specific prep

### Phase 6: Advanced Features (Planned)
- Resume optimizer
- Cover letter generator
- Email draft generator

## Troubleshooting

### Isla Chat Not Working
Check CloudWatch logs:
```bash
aws logs tail /aws/lambda/job-tracker-isla-chat-dev --follow
```

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

## Isla AI Capabilities

- **Conversational AI**: Powered by Claude 3 Sonnet (Bedrock)
- **Web Search**: Real-time search via Tavily API
- **Context-Aware**: Knows your applications and provides personalized advice
- **Job Market Insights**: Latest trends, salaries, company info
- **Interview Prep**: Best practices, STAR method, company research
- **Career Advice**: Follow-ups, networking, job search strategies

## License

MIT License - feel free to use for personal or commercial projects.

## Contributing

Contributions welcome! Please open an issue or PR.

## Contact

For questions or support, please open an issue on GitHub.
