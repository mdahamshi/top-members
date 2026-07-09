# Deployment Guide

## Prerequisites

- k3s cluster running
- Ingress controller (Traefik — ships with k3s)
- Ansible control node (or Jenkins with the custom Docker image)
- DNS records pointing to your k3s node

## Automated Deployment (CI/CD)

Deployment is handled by the Jenkins pipeline via Ansible:

1. Jenkins builds Docker images and pushes them to GHCR
2. Jenkins clones the [`ansible-homelab`](https://github.com/mdahamshi/ansible-homelab) repo
3. Ansible playbook applies the k8s manifests with the new image tag

## Manual Deployment

### 1. Create Namespace

```bash
kubectl create namespace top-members
```

### 2. Create Secrets

```bash
kubectl create secret generic top-members-secrets \
  --namespace top-members \
  --from-literal=POSTGRES_DB=saramsg \
  --from-literal=POSTGRES_USER=saramsg \
  --from-literal=POSTGRES_PASSWORD=<your-password> \
  --from-literal=DATABASE_URL=postgres://saramsg:<your-password>@postgres:5432/saramsg \
  --from-literal=MEMBERSHIP_PASSCODE=<your-passcode> \
  --from-literal=SESSION_SECRET=<random-secret>

  #or use the provided example-secrets.yaml

  cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Secret
metadata:
  name: top-members-secrets
type: Opaque
stringData:
  POSTGRES_DB: saramsg
  POSTGRES_USER: saramsg
  POSTGRES_PASSWORD: secret
  DATABASE_URL: postgres://saramsg:secret@postgres:5432/saramsg
  MEMBERSHIP_PASSCODE: "stop the war on gaza"
  SESSION_SECRET: "change-this-to-a-random-secret"
EOF
```

### 3. Deploy All Resources

```bash
# update ingress-patch.yaml with your host

# From the repo root
kubectl apply -k k8s/prod
```

This deploys:

- PostgreSQL StatefulSet + PVC
- Server Deployment + Service
- Client Deployment + Service
- ConfigMaps (nginx config, app config, DB init scripts)
- Ingress rules

### 4. Verify

```bash
kubectl get pods -n top-members -w
kubectl get svc -n top-members
kubectl get ingress -n top-members
```

### 5. Seed the Database

```bash
cd scripts && ./create-k8s-seed.sh top-members
```

### 6. Access

Visit `https://top-members-k3s.sarawebs.com` (or your configured hostname).

## Updating via Ansible

Run the `ansible-homelab` playbook locally:

```bash
git clone https://github.com/mdahamshi/ansible-homelab.git
cd ansible-homelab
ansible-playbook deploy.yml -e "image_tag=<build-number>"
```

Or simply re-run the Jenkins pipeline.
