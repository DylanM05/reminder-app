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
                    if (fileExists('reminder-app/package.json')) {
                        bat 'cd reminder-app && npm install && npm run build'
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
                    if (fileExists('reminder-app/package.json')) {
                        bat 'cd reminder-app && npm test -- --coverage --passWithNoTests'
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

        stage('Deliver') {
            steps {
                script {
                    // Archive frontend and backend artifacts
                    archiveArtifacts artifacts: 'reminder-app/build/**', fingerprint: true
                    archiveArtifacts artifacts: 'backend/**', fingerprint: true
                }
            }
        }

        stage('Deploy to Dev Env') {
            steps {
                script {
                    echo 'Deploying to Development Environment...'
                    bat '''
                        cd reminder-app/build
                        xcopy /E /I /Y . C:\\inetpub\\wwwroot\\reminder-app-frontend
                    '''

                    // Deploy the backend
                    bat '''
                        cd backend
                        npm install -g pm2
                        pm2 stop reminder-backend || true
                        pm2 start server.js --name reminder-backend
                    '''

                    echo 'Application deployed successfully!'
                }
            }
        }

        // Mock deploy stages
        stage('Deploy to QAT Env') {
            steps {
                script {
                    echo 'Deploying to QAT Environment...'
                    echo 'QAT deployment mock completed.'
                }
            }
        }

        stage('Deploy to Staging Env') {
            steps {
                script {
                    echo 'Deploying to Staging Environment...'
                    echo 'Staging deployment mock completed.'
                }
            }
        }

        stage('Deploy to Production Env') {
            steps {
                script {
                    echo 'Deploying to Production Environment...'
                    echo 'Production deployment mock completed.'
                }
            }
        }
    }
}
