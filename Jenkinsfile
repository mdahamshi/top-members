pipeline {
    agent any

    environment {
        REGISTRY = 'ghcr.io/mdahamshi'
        CLIENT_IMAGE = "${REGISTRY}/top-members-client"
        SERVER_IMAGE = "${REGISTRY}/top-members-server"
        IMAGE_TAG = "${BUILD_NUMBER}"
        K8_STAGING_NS = "staging"
        K8_PROD_NS = "top-members"
    }

    stages {

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
                withCredentials([string(credentialsId: 'k3s-kubeconfig', variable: 'KUBECONFIG_CONTENT')]) {
                    sh '''
                        echo "$KUBECONFIG_CONTENT" | base64 -d > /tmp/k3s-config
                        chmod 600 /tmp/k3s-config
                        sed -i 's|newTag: ".*"|newTag: "'"$IMAGE_TAG"'"|' k8s/staging/kustomization.yaml
                        kubectl --kubeconfig=/tmp/k3s-config apply -k k8s/staging
                        kubectl --kubeconfig=/tmp/k3s-config rollout status deployment/client -n $K8_STAGING_NS --timeout=120s
                        kubectl --kubeconfig=/tmp/k3s-config rollout status deployment/server -n $K8_STAGING_NS --timeout=120s
                        kubectl --kubeconfig=/tmp/k3s-config rollout status statefulset/postgres -n $K8_STAGING_NS --timeout=120s
                        rm -f /tmp/k3s-config
                    '''
                }
            }
        }

        stage('Deploy Prod') {
            input {
                message 'Deploy to production?'
                ok 'Yes, deploy to production'
            }
            steps {
                withCredentials([string(credentialsId: 'k3s-kubeconfig', variable: 'KUBECONFIG_CONTENT')]) {
                    sh '''
                        echo "$KUBECONFIG_CONTENT" | base64 -d > /tmp/k3s-config
                        chmod 600 /tmp/k3s-config
                        sed -i 's|newTag: ".*"|newTag: "'"$IMAGE_TAG"'"|' k8s/prod/kustomization.yaml
                        kubectl --kubeconfig=/tmp/k3s-config apply -k k8s/prod
                        kubectl --kubeconfig=/tmp/k3s-config rollout status deployment/client -n $K8_PROD_NS --timeout=120s
                        kubectl --kubeconfig=/tmp/k3s-config rollout status deployment/server -n $K8_PROD_NS --timeout=120s
                        kubectl --kubeconfig=/tmp/k3s-config rollout status statefulset/postgres -n $K8_PROD_NS --timeout=120s
                        rm -f /tmp/k3s-config
                    '''
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
