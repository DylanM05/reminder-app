pipeline {
    agent any

    stages {
stage('Checkout') {
    steps {
        script {
            git branch: 'main', url: 'https://github.com/DylanM05/reminder-app'
        }
    }
stage('Build') {
    steps {
        bat 'npm install'
    }
}

        stage('Test') {
            steps {
                bat 'npm test -- --coverage'
            }
        }
        stage('SonarQube Analysis') {
            steps {
                bat 'sonar-scanner'
            }
        }
        stage('Deploy') {
            steps {
                echo "Deploying application..."
            }
        }
    }
}
