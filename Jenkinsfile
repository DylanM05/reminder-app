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
                    // Test backend if package.json contains test script
                    if (fileExists('backend/package.json')) {
                        def packageJson = readFile('backend/package.json')
                        if (packageJson.contains('"test"')) {
                            bat 'cd backend && npm test -- --coverage'
                        } else {
                            echo "No tests in backend to run."
                        }
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
