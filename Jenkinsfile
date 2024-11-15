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
                script {
                    // Ensure the directories exist before trying to install dependencies
                    if (fileExists('frontend/package.json')) {
                        bat 'cd frontend && npm install'
                    }
                    if (fileExists('backend/package.json')) {
                        bat 'cd backend && npm install'
                    }
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    // Run tests for frontend and backend separately
                    if (fileExists('frontend/package.json')) {
                        bat 'cd frontend && npm test -- --coverage'
                    }
                    if (fileExists('backend/package.json')) {
                        bat 'cd backend && npm test -- --coverage'
                    }
                }
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
