# Top Members

A full-stack messaging and member management application migrated from Docker Compose/Coolify to k3s Kubernetes with Jenkins CI/CD.

## Architecture Diagram

```mermaid
flowchart LR
    GitHub[Git Server] --> Jenkins
    Jenkins --> GHCR[GHCR Container Registry]
    GHCR --> k3s
    k3s --> Client[React Frontend]
    Client --> Server[Express API]
    Server --> PostgreSQL
    Cloudflare --> k3s
```

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Flowbite React, Vite, Tailwind CSS |
| **Backend** | Node.js, Express, Passport.js |
| **Database** | PostgreSQL 15 |
| **Container** | Docker, multi-stage builds |
| **Orchestration** | k3s Kubernetes |
| **CI/CD** | Jenkins Declarative Pipeline |
| **Registry** | GitHub Container Registry (GHCR) |
| **Ingress** | Traefik (k3s built-in) |
| **Infrastructure** | Proxmox → k3s → Cloudflare Tunnel |

## Project Structure

```
├── client/              # React frontend
│   ├── Dockerfile
│   └── nginx.conf
├── server/              # Express API backend
│   ├── Dockerfile
│   └── src/
├── k8s/
│   ├── base/            # Kustomize base manifests
│   ├── staging/         # Staging overlay
│   └── prod/            # Production overlay
├── Jenkinsfile           # CI/CD pipeline
└── docs/                # Documentation
```

## Deployment Flow

```mermaid
flowchart LR
    Push[Git Push] --> Jenkins[Trigger Jenkins]
    Jenkins --> Build[npm ci + vite build]
    Build --> Test[npm test]
    Test --> Docker[Docker Build & Push]
    Docker --> Staging[Deploy to Staging]
    Staging --> Approval{Manual Approval}
    Approval --> Prod[Deploy to Production]
```

## Quick Start (Development)

```bash
git clone https://github.com/mdahamshi/top-members.git
cd top-members
npm install
npm run dev
```

## Deployment

See [docs/deployment.md](docs/deployment.md) for Kubernetes deployment guide.  
See [docs/ci-cd.md](docs/ci-cd.md) for Jenkins pipeline setup.

## Screenshots

![Screenshot](sc.png)

![Screenshot](sc2.png)

![Screenshot](docs/screenshots/kube-all.png)

## Migration Journey

```mermaid
flowchart LR
    Compose[Docker Compose] --> Coolify[Coolify / Proxmox]
    Coolify --> K8s[Manual k8s Manifests]
    K8s --> Jenkins[Jenkins CI/CD]
```

## Lessons Learned

- Kustomize overlays simplify environment management (staging vs prod)
- StatefulSets for databases require careful PVC planning
- Jenkins with Docker Pipeline plugin streamlines image builds
- Cloudflare Tunnel + k3s Traefik works seamlessly for private clusters
