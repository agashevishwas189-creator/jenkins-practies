pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
        timestamps()
    }

    environment {
        DOCKERHUB_NAMESPACE = 'agashevishwas'
        FRONTEND_IMAGE = 'agashevishwas/job-portal-frontend'
        BACKEND_IMAGE = 'agashevishwas/job-portal-backend'
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

                    test -f frontend/Dockerfile
                    test -f frontend/package.json
                    test -f backend/Dockerfile
                    test -f backend/package.json
                    test -f backend/src/server.js

                    echo "Project files validated successfully."
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                    set -eu

                    docker build \
                      -t "$FRONTEND_IMAGE:$BUILD_NUMBER" \
                      -t "$FRONTEND_IMAGE:latest" \
                      ./frontend

                    docker build \
                      -t "$BACKEND_IMAGE:$BUILD_NUMBER" \
                      -t "$BACKEND_IMAGE:latest" \
                      ./backend
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
                        docker push "$FRONTEND_IMAGE:latest"

                        docker push "$BACKEND_IMAGE:$BUILD_NUMBER"
                        docker push "$BACKEND_IMAGE:latest"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: Build and Docker Hub push completed.'
        }

        failure {
            echo 'FAILED: Check the stage logs above for the error.'
        }

        always {
            echo 'Pipeline execution completed.'
        }
    }
}
