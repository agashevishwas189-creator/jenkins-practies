🚀 Job Portal — DevOps CI/CD Project

Automated deployment of a full-stack Job Portal application using Jenkins, Docker, GitHub Webhooks, and Kubernetes (K3s) on AWS EC2.

🔗 Project Repository: View Job Portal on GitHub

📌 Project Overview

This project demonstrates an end-to-end DevOps workflow for building, containerizing, and deploying a Job Portal application.

The pipeline integrates GitHub with Jenkins, builds Docker images for the frontend and backend, pushes the images to Docker Hub, and deploys the application to a K3s Kubernetes cluster.

🛠️ Tech Stack
Technology	Purpose
AWS EC2	Cloud infrastructure
Git and GitHub	Source code management
GitHub Webhooks	Automatic pipeline triggers
Jenkins	CI/CD automation
Docker	Application containerization
Docker Hub	Container image registry
K3s Kubernetes	Container orchestration
Traefik Ingress	Application routing
Node.js / Express	Backend API
MySQL	Database
Nginx	Frontend web server
🏗️ Architecture
             Developer
                 |
                 v
           GitHub Repository
                 |
           GitHub Webhook
                 |
                 v
              Jenkins
                 |
          Validate Source Code
                 |
          Build Docker Images
                 |
                 v
             Docker Hub
                 |
                 v
          K3s Kubernetes
            on AWS EC2
                 |
        +--------+--------+
        |                 |
        v                 v
   Frontend Pod       Backend Pod
   (Nginx)          (Node.js API)
        |                 |
        v                 v
   Frontend Service  Backend Service
                          |
                          v
                     MySQL Database

        Traefik Ingress → Frontend

📂 Project Structure
jenkins-practies/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       └── server.js
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── index.html
│   └── nginx.conf
├── k8s/
│   ├── backend.yml
│   ├── frontend.yml
│   └── ingress.yml
├── Jenkinsfile
├── docker-compose.yml
├── .gitignore
└── README.md

⚙️ CI/CD Pipeline

The Jenkins pipeline automates the following stages:

Checkout: Fetches the latest source code from GitHub.
Validate Project: Checks required application files and tools.
Build Docker Images: Builds separate frontend and backend images.
Push Images: Publishes the images to Docker Hub using Jenkins credentials.
Deploy to K3s: Applies Kubernetes manifests and deploys the new images.
Verify Deployment: Checks Kubernetes rollout status and application resources.
Pipeline Flow
GitHub Push
    ↓
Webhook Trigger
    ↓
Jenkins Pipeline
    ↓
Build Frontend & Backend
    ↓
Push Images to Docker Hub
    ↓
Deploy to K3s
    ↓
Verify Rollout

🐳 Docker Hub Images
Frontend: job-portal-frontend
Backend: job-portal-backend

The pipeline uses Jenkins build-number tags to identify image versions.

☸️ Kubernetes Deployment

The k8s/ directory contains the Kubernetes manifests.

File	Description
backend.yml	Backend Deployment and Service
frontend.yml	Frontend Deployment and Service
ingress.yml	Traefik Ingress routing
Check Cluster Resources
kubectl get nodes
kubectl get pods
kubectl get deployments
kubectl get services
kubectl get ingress

Verify Deployments
kubectl rollout status deployment/backend
kubectl rollout status deployment/frontend

🔌 Backend API Endpoints
Method	Endpoint	Description
GET	/api/health	Application health check
GET	/api/jobs	Retrieve job listings
POST	/api/jobs	Create a job listing
🗄️ Database Configuration

The backend uses environment variables for database connectivity:

DB_HOST
DB_PORT
DB_USER
DB_PASSWORD
DB_NAME

Kubernetes injects these values from the db-secret Secret. Never commit actual passwords, access tokens, or private credentials to GitHub.

🔐 Security Practices
Store Docker Hub credentials in Jenkins Credentials.
Keep database passwords outside source control.
Use Kubernetes Secrets for sensitive application configuration.
Avoid exposing administrative services publicly.
Prefer restricted Kubernetes permissions for Jenkins deployments.
Review certificate files before publishing them.
🚀 Future Improvements
Improve the frontend job cards and search functionality.
Add automated tests to the CI/CD pipeline.
Configure HTTPS with TLS.
Add application monitoring and centralized logging.
Implement Kubernetes readiness and liveness probes.
Configure automated rollback and deployment notifications.
👨‍💻 Project Purpose
This project is built for hands-on learning and demonstration of DevOps concepts, including CI/CD automation, Docker image management, Kubernetes deployment, and cloud infrastructure.

Note: This is a demonstration project. Verify application functionality, security settings, and infrastructure configuration before using it in production.
