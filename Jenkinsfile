pipeline {
    agent any

    stages {
stage('Checkout') {
    steps {
        script {
            git branch: 'main', url: 'https://github.com/DylanM05/reminder-app'
        }
    }
}
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                sh 'npm test -- --coverage'
            }
        }
        stage('SonarQube Analysis') {
            steps {
                sh 'sonar-scanner'
            }
        }
        stage('Deploy') {
            steps {
                echo "Deploying application..."
            }
        }
    }
}
