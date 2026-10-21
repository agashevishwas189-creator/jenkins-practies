
pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        FRONTEND_IMAGE = 'agashevishwas/job-portal-frontend'
        BACKEND_IMAGE  = 'agashevishwas/job-portal-backend'
        COMPOSE_PROJECT_NAME = 'jenkins-practies'
        DEPLOY_ENV_FILE = '/etc/job-portal/production.env'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Validate Project') {
            steps {
                sh '''
                    set -eu

                    test -f Jenkinsfile
                    test -f docker-compose.yml
                    test -f frontend/Dockerfile
                    test -f frontend/package.json
                    test -f backend/Dockerfile
                    test -f backend/package.json
                    test -f backend/src/server.js
                    test -f backend/global-bundle.pem
                    test ! -f .env

                    echo "Project validation successful."
                '''

                sh '''
                    set -eu
                    docker --version
                    docker compose version
                    test -r "$DEPLOY_ENV_FILE"
                    echo "Docker and deployment configuration available."
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                    set -eu

                    docker build \
                      --pull \
                      -t "$FRONTEND_IMAGE:$BUILD_NUMBER" \
                      -t "$FRONTEND_IMAGE:latest" \
                      ./frontend

                    docker build \
                      --pull \
                      -t "$BACKEND_IMAGE:$BUILD_NUMBER" \
                      -t "$BACKEND_IMAGE:latest" \
                      ./backend

                    echo "Docker images built successfully."
                '''
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKERHUB_USER',
                        passwordVariable: 'DOCKERHUB_TOKEN'
                    )
                ]) {
                    sh '''
                        set -eu
                        set +x

                        echo "$DOCKERHUB_TOKEN" |
                          docker login \
                            --username "$DOCKERHUB_USER" \
                            --password-stdin

                        trap 'docker logout >/dev/null 2>&1 || true' EXIT

                        docker push "$FRONTEND_IMAGE:$BUILD_NUMBER"
                        docker push "$BACKEND_IMAGE:$BUILD_NUMBER"

                        docker push "$FRONTEND_IMAGE:latest"
                        docker push "$BACKEND_IMAGE:latest"

                        echo "Images pushed successfully."
                    '''
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKERHUB_USER',
                        passwordVariable: 'DOCKERHUB_TOKEN'
                    )
                ]) {
                    sh '''
                        set -eu
                        set +x

                        export IMAGE_TAG="$BUILD_NUMBER"

                        echo "$DOCKERHUB_TOKEN" |
                          docker login \
                            --username "$DOCKERHUB_USER" \
                            --password-stdin

                        trap 'docker logout >/dev/null 2>&1 || true' EXIT

                        docker compose \
                          --project-name "$COMPOSE_PROJECT_NAME" \
                          --env-file "$DEPLOY_ENV_FILE" \
                          pull

                        docker compose \
                          --project-name "$COMPOSE_PROJECT_NAME" \
                          --env-file "$DEPLOY_ENV_FILE" \
                          up -d --no-build --remove-orphans

                        echo "Deployment commands completed."
                    '''
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    set -eu

                    echo "Waiting for application startup..."
                    sleep 5

                    docker compose \
                      --project-name "$COMPOSE_PROJECT_NAME" \
                      --env-file "$DEPLOY_ENV_FILE" \
                      ps

                    echo "Checking application and RDS health..."

                    curl --fail --silent --show-error \
                      --retry 6 \
                      --retry-delay 5 \
                      --retry-connrefused \
                      http://localhost:8081/api/health

                    echo ""

                    echo "Checking jobs API..."
                    curl --fail --silent --show-error \
                      http://localhost:8081/api/jobs

                    echo ""
                    echo "Deployment verification successful."
                '''
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: Build, push, deployment and health checks completed.'
        }

        failure {
            echo 'FAILED: Inspect the stage logs and fix the reported error.'
        }

        always {
            echo 'Pipeline execution completed.'
        }
    }
}
