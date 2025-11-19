pipeline {
  agent any

  environment {
    REGISTRY    = "192.168.56.20:5000"
    KUBE_CONFIG = "/home/vagrant/.kube/config"
    IMAGE_TAG   = "${BUILD_NUMBER}"
    K8S_NS      = "cicd-lab"
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
            docker build -t ${REGISTRY}/frontend:${IMAGE_TAG} .
          """
        }
      }
    }

    stage('Push frontend image') {
      steps {
        sh """
          docker push ${REGISTRY}/frontend:${IMAGE_TAG}
        """
      }
    }

    stage('Build backend image') {
      steps {
        dir('backend') {
          sh """
            docker build -t ${REGISTRY}/backend:${IMAGE_TAG} .
          """
        }
      }
    }

    stage('Push backend image') {
      steps {
        sh """
          docker push ${REGISTRY}/backend:${IMAGE_TAG}
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
          KUBECONFIG=${KUBE_CONFIG} kubectl -n ${K8S_NS} set image deployment/frontend frontend=${REGISTRY}/frontend:${IMAGE_TAG}
          KUBECONFIG=${KUBE_CONFIG} kubectl -n ${K8S_NS} set image deployment/backend  backend=${REGISTRY}/backend:${IMAGE_TAG}
        """
      }
    }
  }
}
