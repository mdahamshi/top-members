pipeline {
    agent any

    environment {
        REGISTRY = 'ghcr.io/mdahamshi'
        CLIENT_IMAGE = "${REGISTRY}/top-members-client"
        SERVER_IMAGE = "${REGISTRY}/top-members-server"
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            agent {
                docker {
                    image 'node:20-alpine'
                    reuseNode true
                }
            }
            steps {
                sh 'npm ci'
                sh 'npm run build --prefix client'
            }
        }

        stage('Test') {
            agent {
                docker {
                    image 'node:20-alpine'
                    reuseNode true
                }
            }
            steps {
                sh 'npm test --prefix server'
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    docker.withRegistry('https://ghcr.io', 'github-user-pass') {
                        def clientImage = docker.build("${CLIENT_IMAGE}:${IMAGE_TAG}", './client')
                        clientImage.push()
                        clientImage.push('latest')

                        def serverImage = docker.build("${SERVER_IMAGE}:${IMAGE_TAG}", './server')
                        serverImage.push()
                        serverImage.push('latest')
                    }
                }
            }
        }

        stage('Deploy Staging') {
            steps {
                script {
                    sh """
                        sed -i 's/\${IMAGE_TAG}/${IMAGE_TAG}/g' k8s/staging/kustomization.yaml
                        kubectl apply -k k8s/staging
                        kubectl rollout status deployment/client -n staging --timeout=120s
                        kubectl rollout status deployment/server -n staging --timeout=120s
                        kubectl rollout status statefulset/postgres -n staging --timeout=120s
                    """
                }
            }
        }

        stage('Deploy Prod') {
            input {
                message 'Deploy to production?'
                ok 'Yes, deploy to production'
            }
            steps {
                script {
                    sh """
                        sed -i 's/\${IMAGE_TAG}/${IMAGE_TAG}/g' k8s/prod/kustomization.yaml
                        kubectl apply -k k8s/prod
                        kubectl rollout status deployment/client --timeout=120s
                        kubectl rollout status deployment/server --timeout=120s
                        kubectl rollout status statefulset/postgres --timeout=120s
                    """
                }
            }
        }
    }

    post {
        failure {
            echo 'Pipeline failed. Check logs for details.'
        }
    }
}
