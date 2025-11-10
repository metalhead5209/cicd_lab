pipeline {
  agent any

  environment {
    REGISTRY    = "192.168.56.20:5000"
    KUBE_CONFIG = "/home/vagrant/.kube/config"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build frontend image') {
      steps {
        dir('frontend') {
          sh """
            docker build -t ${REGISTRY}/frontend:latest .
          """
        }
      }
    }

    stage('Push frontend image') {
      steps {
        sh """
          docker push ${REGISTRY}/frontend:latest
        """
      }
    }

    stage('Build backend image') {
      steps {
        dir('backend') {
          sh """
            docker build -t ${REGISTRY}/backend:latest .
          """
        }
      }
    }

    stage('Push backend image') {
      steps {
        sh """
          docker push ${REGISTRY}/backend:latest
        """
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        sh """
          KUBECONFIG=${KUBE_CONFIG} kubectl apply -f k8s/namespace.yml
          KUBECONFIG=${KUBE_CONFIG} kubectl apply -f k8s/backend-deployment.yml
          KUBECONFIG=${KUBE_CONFIG} kubectl apply -f k8s/backend-service.yml
          KUBECONFIG=${KUBE_CONFIG} kubectl apply -f k8s/frontend-deployment.yml
          KUBECONFIG=${KUBE_CONFIG} kubectl apply -f k8s/frontend-service.yml
        """
      }
    }
  }
}
