# SummarAI 🚀

### AI-Powered Text Summarization & Technology News Platform

SummarAI is a full-stack web application that uses artificial intelligence to summarize text and technology news articles. It combines a React frontend with a Java Spring Boot backend and integrates OpenAI and GNews APIs.

The application is containerized using Docker and deployed on AWS.

**Live Application:** https://d2l163kqlg2jao.cloudfront.net

## ✨ Features

- **AI Text Summarization:** Generate concise summaries from user-provided text.
- **Technology News:** Fetch recent technology news articles using GNews.
- **AI News Summaries:** Summarize news articles using OpenAI.
- **Responsive UI:** Modern interface built with React and Tailwind CSS.
- **Dark & Light Themes:** Switch between themes.
- **REST API Integration:** Communication between React and Spring Boot.
- **Cloud Deployment:** Publicly accessible application hosted on AWS.
- **Centralized Logging:** Backend container logs collected in Amazon CloudWatch.

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, Tailwind CSS, JavaScript |
| Backend | Java 17, Spring Boot, Maven |
| AI Integration | OpenAI API |
| News Integration | GNews API |
| Containerization | Docker |
| Cloud | AWS EC2, S3, CloudFront |
| Monitoring | Amazon CloudWatch |
| Version Control | Git, GitHub |

## 🏗️ Application Architecture

```text
                    Users
                      |
                   HTTPS
                      |
                CloudFront
                 /      \
                /        \
          S3 Bucket     EC2 Instance
          (Frontend)         |
                         Docker
                            |
                      Spring Boot
                       REST APIs
                       /      \
                      /        \
                OpenAI API   GNews API
```

### Architecture Overview

1. The React application is built using Vite and stored in a private Amazon S3 bucket.
2. Amazon CloudFront delivers the frontend over HTTPS.
3. CloudFront routes `/api/*` requests to the Spring Boot backend running inside Docker on Amazon EC2.
4. Spring Boot integrates with OpenAI for AI summarization and GNews for technology news.
5. Docker container logs are forwarded to Amazon CloudWatch.

## 📁 Project Structure

```text
SummarAI/
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## 🔌 REST API Endpoints

### Summarize Text

`POST /api/summarize`

Example request:

```json
{
  "text": "Artificial intelligence is transforming software development."
}
```

Example response (illustrative):

```json
{
  "summary": "AI is transforming software development."
}
```

### Fetch Technology News

`GET /api/news/technology`

Retrieves technology news articles through the GNews integration.

## 💻 Running Locally

### Prerequisites

- Java 17
- Maven
- Node.js and npm
- OpenAI API key
- GNews API key

### Backend Setup

```bash
cd backend
```

Configure the required environment variables:

```text
OPENAI_API_KEY=your_openai_api_key
GNEWS_API_KEY=your_gnews_api_key
```

Run the Spring Boot application:

```bash
mvn spring-boot:run
```

The backend runs at:

`http://localhost:8080`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs locally at:

`http://localhost:5173`

**Note:** Configure the frontend API URLs to point to your local backend when running locally.

## ☁️ AWS Deployment

The application uses the following AWS services:

- **Amazon EC2:** Hosts the Dockerized Spring Boot backend.
- **Amazon S3:** Stores the production React build.
- **Amazon CloudFront:** Delivers the frontend and routes API requests.
- **Amazon CloudWatch:** Collects backend application logs.
- **AWS IAM:** Manages deployment and logging permissions.
- **Security Groups:** Restrict network access to the EC2 instance.

The backend Docker image is deployed to EC2, while the production React build is uploaded to S3 and served through CloudFront.

## 🔐 Security Considerations

- API keys are supplied through environment variables.
- `.env` files and private keys are excluded from Git.
- The S3 frontend bucket is private.
- SSH access to EC2 is restricted.
- CORS configuration allows the development and deployed frontend origins.

**Planned security improvements:** Authentication, API rate limiting, origin verification, and HTTPS between CloudFront and the backend origin.

## 🗺️ Future Enhancements

- User registration and login using Spring Security and JWT.
- User dashboard and summary history.
- Save and manage favourite summaries.
- PDF and DOCX summarization.
- Enhanced UI/UX and mobile responsiveness.
- Redis caching and API rate limiting.
- Unit and integration testing.
- GitHub Actions CI/CD.
- Microservices architecture using Spring Cloud.
- Apache Kafka for asynchronous event-driven processing.
- Database persistence using PostgreSQL or MySQL.

## 👨‍💻 Developer

**Mahesh Mantrala**

GitHub: https://github.com/maheshmantrala

## 📌 Project Status

The initial full-stack application is deployed and accessible online. Additional features and architecture improvements are planned.

**Live Demo:** https://d2l163kqlg2jao.cloudfront.net
