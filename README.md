
# cicd_lab

This repository contains a complete home lab for learning and practicing CI/CD using:

- VirtualBox + Vagrant for virtual machines
- Ansible for provisioning and configuration management
- Jenkins for CI/CD automation
- Docker for containerization & private registry
- Kubernetes for running the application in a small cluster

The goal is to simulate a realistic workflow:

> Developer pushes code → GitHub Webhook → Jenkins builds & pushes Docker images → Kubernetes deploys/updates the app


## 1. Lab Architecture

### 1.1 Vagrant Nodes

The lab is built around three VMs:

| Hostname | IP              | Role                               |
|----------|----------------|------------------------------------|
| ctrl1    | 192.168.56.10  | Kubernetes control plane (master)  |
| wk1      | 192.168.56.11  | Kubernetes worker node             |
| cicd     | 192.168.56.20  | Jenkins, Docker, private registry  |

Vagrant defines these nodes with CPU/RAM sizing and port forwarding (for Jenkins):


NODES = {
  "ctrl1" => { ip: "192.168.56.10", cpu: 2, ram: 4096 },
  "wk1"   => { ip: "192.168.56.11", cpu: 2, ram: 4096 },
  "cicd"  => { ip: "192.168.56.20", cpu: 2, ram: 4096, pf: { 8080 => 8080 } } # Jenkins
}


### 1.2 High-Level Flow
+-------------------+     +--------------+     +-----------------------+
|    Developer      | --> |   GitHub     | --> |      Jenkins (CI/CD)  |
|  (local machine)  |     |    Repo      |     |  builds & pushes      |
+-------------------+     +--------------+     +-----------+-----------+
                                                                |
                                                                v
                                                   +------------+-----------+
                                                   |    Docker Registry     |
                                                   |   192.168.56.20:5000   |
                                                   +------------+-----------+
                                                                |
                                                                v
                                                   +------------+-----------+
                                                   | Kubernetes Cluster     |
                                                   | ctrl1 (master) + wk1   |
                                                   | Runs frontend/backend  |
                                                   +------------------------+




## 2. Components

### 2.1 Ansible

Ansible is used to:

* Update and configure all nodes
* Install or remove Docker on designated nodes
* Install Node.js where required

Playbooks in ansible/playbooks/:

* docker_pb.yml – Docker install/config
* update.yml – updates all apt packages
* remove_docker.yml – removes Docker from designated nodes
* node.yml – installs Node.js on designated nodes

Inventory example:


[master]
ctrl1 ansible_host=192.168.56.10

[worker]
wk1 ansible_host=192.168.56.11

[cicd]
cicd ansible_host=192.168.56.20


### 2.2 Jenkins

Jenkins runs on the cicd node:

* Accessible from the host at: http://localhost:8080 (via port forwarding)
* Uses a Pipeline defined by the Jenkinsfile
* Integrates with:

  * Docker (to build images)
  * Local Docker registry (192.168.56.20:5000)
  * Kubernetes (KUBECONFIG=/home/vagrant/.kube/config)

---

### 2.3 Docker & Private Registry

On cicd:

* Docker is installed and used by Jenkins
* A private registry listens on 192.168.56.20:5000

Images are tagged like:

* 192.168.56.20:5000/frontend:<BUILD_NUMBER>
* 192.168.56.20:5000/backend:<BUILD_NUMBER>

---

### 2.4 Kubernetes Cluster

Cluster layout:

* ctrl1 is the control-plane node
* wk1 is a worker node

Installed with:

* kubeadm init on ctrl1
* kubeadm join on wk1
* Calico CNI plugin for networking

Namespace:


cicd-lab

Deployed components:

* Backend Deployment & Service
* Frontend Deployment & Service
* Frontend exposed via NodePort (30080)

Access the app from the host:

http://192.168.56.11:30080

## 3. Repository Structure

├── ansible/
│   ├── inventories/
│   │   └── hosts.yml
│   ├── playbooks/
│   │   ├── docker_pb.yml
│   │   ├── node.yml
│   │   ├── remove_docker.yml
│   │   └── update.yml
│   └── ansible.cfg
│
├── backend/
│   ├── api.test.js
│   ├── dockerfile
│   ├── index.js
│   ├── package-lock.json
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── .gitignore
│   ├── README.md
│   ├── dockerfile
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   └── vite.config.js
│
├── k8s/
│   ├── backend-deployment.yml
│   ├── backend-service.yml
│   ├── frontend-deployment.yml
│   ├── frontend-service.yml
│   └── namespace.yml
│
├── Jenkinsfile
└── README.md

## 4. Frontend (React + Vite)

The frontend lives in the frontend/ directory and is built with React using Vite.

Reasons for this stack:

* Represents a realistic modern frontend workflow
* Produces optimized static assets ideal for containerization
* Fast build times suitable for CI/CD pipelines

The frontend:

* Communicates with the backend API
* Is packaged into its own Docker image
* Gets rebuilt and redeployed through the pipeline


## 5. Backend (Node.js API)

The backend lives in the backend/ directory and provides API functionality.

Reasons for separating the backend:

* Mirrors real-world frontend/API separation
* Allows independent container builds
* Enables Kubernetes to manage multiple deployments/services

The backend:

* Listens on port 3000
* Responds to frontend requests
* Runs as its own containerized service

---

## 6. Dockerfiles & Containerization

Both the frontend and backend are containerized so Jenkins can build/push images and Kubernetes can deploy them.

### 6.1 Backend Dockerfile

Key steps:

dockerfile
FROM node:alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=3000
EXPOSE 3000
CMD ["node","index.js"]


This:

* Provides Node runtime
* Installs dependencies
* Copies application code
* Starts the backend service

### 6.2 Frontend Dockerfile

Typical flow:

dockerfile
FROM node:alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

This:
* Installs dependencies
* Builds the React/Vite application
* Produces optimized static assets (dist/)

The container exposes the built application on port 80.

---

## 7. Why Separate Frontend & Backend Containers?

* Matches common microservice patterns
* Allows independent builds and deployments
* Makes the CI/CD pipeline more realistic
* Enables Kubernetes to manage multiple workloads cleanly

---

## 8. Prerequisites

### Host Machine

* VirtualBox
* Vagrant
* Git
* (Optional) Ansible on host or WSL

### GitHub

* Repository containing this code
* Ability to configure webhooks
