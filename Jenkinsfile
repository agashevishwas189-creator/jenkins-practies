
pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
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

        stage('Build and Push Images') {
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

                        docker build \
                          -t "$FRONTEND_IMAGE:latest" \
                          -t "$FRONTEND_IMAGE:$BUILD_NUMBER" \
                          ./frontend

                        docker build \
                          -t "$BACKEND_IMAGE:latest" \
                          -t "$BACKEND_IMAGE:$BUILD_NUMBER" \
                          ./backend

                        docker push "$FRONTEND_IMAGE:latest"
                        docker push "$FRONTEND_IMAGE:$BUILD_NUMBER"

                        docker push "$BACKEND_IMAGE:latest"
                        docker push "$BACKEND_IMAGE:$BUILD_NUMBER"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: Both Docker images pushed to Docker Hub.'
        }
        failure {
            echo 'FAILED: Check the Jenkins console output.'
        }
        always {
            echo 'Pipeline execution completed.'
        }
    }
}

pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
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

        stage('Build and Push Images') {
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

                        docker build \
                          -t "$FRONTEND_IMAGE:latest" \
                          -t "$FRONTEND_IMAGE:$BUILD_NUMBER" \
                          ./frontend

                        docker build \
                          -t "$BACKEND_IMAGE:latest" \
                          -t "$BACKEND_IMAGE:$BUILD_NUMBER" \
                          ./backend

                        docker push "$FRONTEND_IMAGE:latest"
                        docker push "$FRONTEND_IMAGE:$BUILD_NUMBER"

                        docker push "$BACKEND_IMAGE:latest"
                        docker push "$BACKEND_IMAGE:$BUILD_NUMBER"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: Both Docker images pushed to Docker Hub.'
        }
        failure {
            echo 'FAILED: Check the Jenkins console output.'
        }
        always {
            echo 'Pipeline execution completed.'
        }
    }
}

