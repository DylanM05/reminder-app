pipeline {
    agent any

    environment {
        SONAR_TOKEN = credentials('sonar')
    }

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
                    // Test frontend if exists
                    if (fileExists('frontend/package.json')) {
                        bat 'cd frontend && npm test -- --coverage'
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    withSonarQubeEnv('SonarQube') {
                        bat "sonar-scanner -Dsonar.projectBaseDir=%WORKSPACE% -Dsonar.projectKey=DylanM05_reminder-app -Dsonar.organization=dylanm05 -Dsonar.login=%SONAR_TOKEN%"
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying application..."
            }
        }
    }
}
