# SalmaMembers

SalmaMembers is a self-hosted, full-stack member management and messaging platform built with React, Node.js, and PostgreSQL.

The project is deployed in production using Docker Compose, Coolify, and Cloudflare Tunnel, and is currently being migrated to Kubernetes (k3s) as part of a DevOps-focused infrastructure project.

> 🟢 **Live Demo:** https://link.sarawebs.com/top-members

> 🟢 **Live Demo - K3S:** https://top-members-k3s.sarawebs.com/

---

## Project Branches

| Branch          | Purpose                                                                       |
| --------------- | ----------------------------------------------------------------------------- |
| `main`          | Stable production deployment using Docker Compose + Coolify                   |
| `ansible`       | Ansible-based deployment to k3s with Jenkins CI/CD (active)                  |
| `k8s-migration` | Kubernetes (k3s) migration, CI/CD automation, and infrastructure-as-code work |

The goal of the `k8s-migration` branch is to evolve the application from a Docker Compose deployment into a production-style Kubernetes platform with Jenkins-based CI/CD, container image automation, ingress management, persistent storage, and observability. The `ansible` branch takes this further by replacing direct `kubectl` commands with an Ansible playbook for cleaner, reusable deployments.

---

## Features

* User Authentication – Login, signup, and member role checks
* Message Board – Post, edit, and delete messages
* Pinned Messages – Highlight important announcements
* Inline Editing – Edit messages directly in the UI
* Responsive Design – Mobile-friendly interface
* PostgreSQL Persistence – Durable storage backend
* Self-Hosted Deployment – Runs entirely on self-managed infrastructure
* Production Operations – Backups, monitoring, reverse proxy, and secure remote access

---

## Infrastructure

### Current Production Stack

* Proxmox VE
* Coolify
* Docker Compose
* PostgreSQL
* Cloudflare Tunnel
* Linux (Ubuntu/Debian)

### Kubernetes Migration Stack

* Kubernetes (k3s)
* Jenkins
* Ansible
* Docker
* GitHub Container Registry (GHCR)
* Traefik Ingress
* Helm (planned)
* Prometheus & Grafana (planned)

---

## Screenshots

![Application Screenshot](sc.png)

![Application Screenshot](sc2.png)

![Screenshot](https://raw.githubusercontent.com/mdahamshi/top-members/refs/heads/k8s-migration/docs/screenshots/kube-all.png)

---

## Technology Stack

### Frontend

* React
* Flowbite React
* Tailwind CSS
* Lucide React
* React Router
* date-fns

### Backend

* Node.js
* Express
* PostgreSQL
* REST API

### Infrastructure & DevOps

* Docker
* Docker Compose
* Coolify
* Proxmox VE
* Cloudflare Tunnel
* Kubernetes (k3s)
* Jenkins
* Ansible (new)
* GitHub Actions (planned)
* Helm (planned)

---

## Local Development

```bash
git clone https://github.com/mdahamshi/top-members.git

cd top-members

npm install

npm run dev
```

---

## Roadmap

### Completed

* Dockerized multi-service architecture
* PostgreSQL persistence
* Production deployment via Coolify
* Cloudflare Tunnel exposure
* Automated backups and infrastructure management

### In Progress

* Kubernetes (k3s) migration
* Jenkins CI/CD pipeline
* Ansible deployment automation
* Container registry integration
* Kubernetes ingress configuration

### Planned

* Helm charts
* Prometheus monitoring
* Grafana dashboards
* GitHub Actions workflows
* GitOps with ArgoCD

```
```
