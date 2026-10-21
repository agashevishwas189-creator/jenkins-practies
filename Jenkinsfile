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
        KUBECONFIG = '/var/lib/jenkins/.kube/config'
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
                    test -f frontend/Dockerfile
                    test -f frontend/package.json
                    test -f backend/Dockerfile
                    test -f backend/package.json
                    test -f backend/src/server.js
                    test -f backend/global-bundle.pem
                    test -f k8s/backend.yml
                    test -f k8s/frontend.yml
                    test -f k8s/ingress.yml
                    test ! -f .env

                    docker --version
                    kubectl version --client
                    test -r "$KUBECONFIG"

                    echo "Project validation successful."
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                    set -eu

                    docker build --pull \
                      -t "$FRONTEND_IMAGE:$BUILD_NUMBER" \
                      ./frontend

                    docker build --pull \
                      -t "$BACKEND_IMAGE:$BUILD_NUMBER" \
                      ./backend

                    echo "Images built successfully."
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
                    '''
                }
            }
        }

        stage('Deploy to K3s') {
            steps {
                sh '''
                    set -eu
                    export KUBECONFIG=/var/lib/jenkins/.kube/config

                    # Set this build's immutable image tags in manifests.
                    sed -i \
                      "s|image: agashevishwas/job-portal-backend:latest|image: agashevishwas/job-portal-backend:$BUILD_NUMBER|" \
                      k8s/backend.yml

                    sed -i \
                      "s|image: agashevishwas/job-portal-frontend:latest|image: agashevishwas/job-portal-frontend:$BUILD_NUMBER|" \
                      k8s/frontend.yml

                    kubectl apply -f k8s/backend.yml
                    kubectl apply -f k8s/frontend.yml
                    kubectl apply -f k8s/ingress.yml

                    kubectl set image deployment/backend \
                      backend="$BACKEND_IMAGE:$BUILD_NUMBER"

                    kubectl set image deployment/frontend \
                      frontend="$FRONTEND_IMAGE:$BUILD_NUMBER"

                    echo "Kubernetes deployment applied."
                '''
            }
        }

        stage('Verify Kubernetes Deployment') {
            steps {
                sh '''
                    set -eu
                    export KUBECONFIG=/var/lib/jenkins/.kube/config

                    kubectl rollout status deployment/backend \
                      --timeout=180s

                    kubectl rollout status deployment/frontend \
                      --timeout=180s

                    kubectl get deployments
                    kubectl get pods
                    kubectl get ingress

                    echo "Kubernetes rollout verification successful."
                '''
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: Images built, pushed and deployed to K3s.'
        }

        failure {
            echo 'FAILED: Check the failed stage logs.'
        }

        always {
            echo 'Pipeline execution completed.'
        }
    }
}
