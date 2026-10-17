
pipeline {
    agent any
    
   environment {
        APP_NAME = 'MyApp'
        ENVIRONMENT = 'main'
    }
    stages {
        stage('checkout-stage') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/agashevishwas189-creator/jenkins-practies.git'
            }
        }

        stage('build-stage') {
            steps {
                sh 'echo "Build stage"'
            }
        }
        stage('test-stage') {
            steps {
                sh 'echo "Test stage"'
            }
        }
    }
     post {
        always {
            echo 'Pipeline execution completed'
        }
     }     
}
